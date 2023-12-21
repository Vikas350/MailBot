# MailBot - Auto Reply Gmail Bot using Node.js 

Description
- This is a repository for Auto_reply_gmail_api_app App Developed using Node.js and Google APIs.
- This app  is able to respond to emails sent to your Gmail mailbox while you’re out on a vacation.

 Features
- Checks for new emails in a given Gmail ID.
- Sends replies to emails that have no prior replies.
- Adds a label to the email and moves the email to the label.
- This app checks above steps every 45 to 120 in b/w sec  random time interval. 

 Libraries  
-1.googleapis:This package is imported from the googleapis module and provides the necessary functionality to interact
   with various Google APIs, including the Gmail API.
-2.OAuth2:The OAuth2 class from the google.auth module is used to authenticate the application and obtain an access
   token for making requests to the Gmail API. It handles token refresh and retrying requests if necessary. 

 Getting Started

First Thing to do go to Google Cloud Console and set up the OAuth 2.0 authentication for
your application, follow these steps:
1. Go to the Google Cloud Console (https://console.developers.google.com) and create a new project. Provide a
   suitable name for your project and click on the "Create" button.
2. Once the project is created, click on the project name to navigate to the project dashboard.
3. In the left sidebar, click on the "Credentials" tab under the "APIs & Services" section.
4. On the Credentials page, click on the "Create credentials" button and select "OAuth client ID" from the
   dropdown menu.
5. Select the application type as "Web application" and provide a name for the OAuth 2.0 client ID.
6. In the "Authorized redirect URIs" field, enter the redirect URI where you want to receive the authorization
   code. For this code, you can use "https://developers.google.com/oauthplayground".
8. Click on the "Create" button to create the OAuth client ID. You will see a modal displaying the client ID
   and client secret. Copy the values of the client ID and client secret. and also enable gmail api 
9. Now, open the OAuth 2.0 Playground (https://developers.google.com/oauthplayground).
10.In the OAuth 2.0 Playground, click on the settings icon (gear icon) on the top right corner. In the
   "OAuth 2.0 configuration" section, enter the client ID and client secret obtained in the previous step.
11.Scroll down and find the "Step 1: Select & authorize APIs" section. In the input box, enter `https://mail.google.com`
   and select the appropriate Gmail API scope.
12.Click on the "Authorize APIs" button. It will redirect you to the Google account login page. Sign in with the
   Google account associated with the Gmail account you want to use for auto-reply.
13.After successful authorization, the OAuth 2.0 Playground will display an authorization code. Copy this code.
14.Now, click on the "Exchange authorization code for tokens" button. It will exchange the authorization code for
   a refresh token.
15.The OAuth 2.0 Playground will display the refresh token. Copy the refresh token value.
16.Now, in your code, replace the placeholder values in the `credentials.js` file with the respective values
   you obtained:
   Replace CLIENT_ID with the client ID value.
   Replace CLEINT_SECRET with the client secret value.
   Replace REDIRECT_URI with the redirect URI value.
   Replace REFRESH_TOKEN with the refresh token value.
17.Save the credentials.js file.

The easiest way to get started is to clone the repository:
```bash
# Get the latest snapshot
git clone https://github.com/Sahil-Sayyad/Auto_reply_gmail_api_app.git

# Install NPM dependencies
npm install

#Install googleapis and nodemon
npm install googleapis nodemon

# Then simply start your app
npm start
```

# LINKS

<h3> <a href = "https://github.com/Sahil-Sayyad/Auto_reply_gmail_api_app"> CODE</a> </h3><br>


note on areas where your code can be improved.
1.Error handling: The code currently logs any errors that occur during the execution but does not
  handle them in a more robust manner.
2.Code efficiency: The code could be optimized to handle larger volumes of emails more efficiently.
3.Security: Ensuring that sensitive information, such as client secrets and refresh tokens, are stored
  securely and not exposed in the   code.
4.User-specific configuration: Making the code more flexible by allowing users to provide their own
  configuration options, such as email    filters or customized reply messages.
  These are some areas where the code can be improved, but overall, it provides implementation of
  auto-reply functionality using the Gmail API.
5.Time Monitoring: The code currently use randominterval function to generate seconds and in this code can be improved by adding cron jobs package to schedule email tasks 

