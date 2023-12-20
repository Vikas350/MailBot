const express = require("express"); // for creating web server
const app = express();
const path = require("path");  // for handling file paths
const { authenticate } = require("@google-cloud/local-auth"); // for google cloud authentication
const fs = require("fs").promises;  // for file system operations
const { google } = require("googleapis");  // for using google APIs

const port = 8080;  // define the port

// these are the scope that we want to access 
const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.labels",
  "https://mail.google.com/",
];


const labelName = "Vacation Auto-Reply"; // define the label name


// Set up a route for handling HTTP GET requests to the root ("/") endpoint.
app.get("/", async (req, res) => {

  // Authenticate with Google using the authenticate function,
  // which is likely handling OAuth2.0 authentication. 
  // It uses the credentials from the "credentials.json" file and specifies the required scopes.
  const auth = await authenticate({
    keyfilePath: path.join(__dirname, "credentials.json"),
    scopes: SCOPES,
  });

  // console.log("this is auth",auth)

  // Create a Gmail API client using the authenticated credentials.
  const gmail = google.gmail({ version: "v1", auth });


  // Retrieve a list of labels associated with the authenticated user's Gmail account.
  const response = await gmail.users.labels.list({
    userId: "me",
  });


  // this is an asynchronous function that retrieves - 
  // list of unread/unseen messages from the authenticated user's inbox
  async function getUnrepliesMessages(auth) {
    const gmail = google.gmail({ version: "v1", auth });
    const response = await gmail.users.messages.list({
      userId: "me",
      labelIds: ["INBOX"],
      q: "is:unread",
    });  // It fetches a list of messages in the user's inbox that are marked as unread and have the label "INBOX."
    

    // This line returns an array of messages obtained from the API response's data property. 
    // If there are no messages, it returns an empty array.
    return response.data.messages || [];
  }

  // this is an asynchronous function responsible for - 
  // creating a label in the authenticated user's Gmail account.
  // If the label already exists, it retrieves the existing label's ID
  async function createLabel(auth) {
    const gmail = google.gmail({ version: "v1", auth });
    try {
      // This line attempts to create a new label using "create" method of Gmail API
      // It provides the user ID, label name (labelName), and visibility settings.
      const response = await gmail.users.labels.create({
        userId: "me",
        requestBody: {
          name: labelName,
          labelListVisibility: "labelShow",
          messageListVisibility: "show",
        },
      });

      return response.data.id;

    } catch (error) {// it means the label already exists.

      if (error.code === 409) {
        // This line fetches a list of existing labels for the user.
        const response = await gmail.users.labels.list({  
          userId: "me",
        });

        // It finds the existing label with the specified name
        const label = response.data.labels.find(  
          (label) => label.name === labelName
        );

        return label.id;

      } else {
        throw error;
      }
    }
  }

  async function main() {
    // function to create a label or retrieve the ID of an existing label
    const labelId = await createLabel(auth);
    // console.log(`Label  ${labelId}`);

    // Repeat  in Random intervals
    setInterval(async () => {

      // get messages that have no prior reply
      const messages = await getUnrepliesMessages(auth);
      // console.log("Unreply messages", messages);

      //  Here i am checking is there any gmail that did not get reply
      if (messages && messages.length > 0) {
        for (const message of messages) {
          // contains detailed information about the specified email message.
          const messageData = await gmail.users.messages.get({
            auth,
            userId: "me",
            id: message.id,
          });

          const email = messageData.data;

          // It checks if there is at least one header with the name "In-Reply-To."
          const hasReplied = email.payload.headers.some(
            (header) => header.name === "In-Reply-To"
          );

          // if not replied to that mail
          if (!hasReplied) {

            // Craft the reply message
            const replyMessage = {
              userId: "me",
              resource: {
                // The raw property is a base64-encoded string
                // representing the email content, including the "To," "Subject," and message body.
                raw: Buffer.from(
                  `To: ${
                    email.payload.headers.find(
                      (header) => header.name === "From"
                    ).value
                  }\r\n` +
                    `Subject: Re: ${
                      email.payload.headers.find(
                        (header) => header.name === "Subject"
                      ).value
                    }\r\n` +
                    `Content-Type: text/plain; charset="UTF-8"\r\n` +
                    `Content-Transfer-Encoding: 7bit\r\n\r\n` +
                    `Thank you for your email. I'm currently on vacation and will reply to you when I return.\r\n`
                ).toString("base64"),
              },
            };

            // This line uses the Gmail API to send the auto-reply message.
            await gmail.users.messages.send(replyMessage); 

            // This line modifies the email by adding the label (labelId)
            // and removing it from the "INBOX" label.
            await gmail.users.messages.modify({
              auth,
              userId: "me",
              id: message.id,
              resource: {
                addLabelIds: [labelId],
                removeLabelIds: ["INBOX"],
              },
            });
          }
        }
      }
    }, Math.floor(Math.random() * (120 - 45 + 1) + 45) * 1000);
  }

  main();
  // const labels = response.data.labels;
  res.json({ "this is Auth": auth });
});

// start the server at 8080 port
app.listen(port, () => {
  console.log(`server is running ${port}`);
});
