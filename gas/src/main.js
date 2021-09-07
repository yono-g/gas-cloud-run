function main() {
  const {
    projectId,
    region,
    queueName,
    workerUrl,
    deploymentId,
    serviceAccountEmail,
  } = PropertiesService.getScriptProperties().getProperties();

  const apiUrl = `https://cloudtasks.googleapis.com/v2/projects/${projectId}/locations/${region}/queues/${queueName}/tasks/`;
  const payload = (() => {
    const body = {
      callbackUrl: `https://script.google.com/macros/s/${deploymentId}/exec`,
    };
    return {
      task: {
        httpRequest: {
          url: workerUrl,
          httpMethod: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: Utilities.base64Encode(JSON.stringify(body)),
          oidcToken: {
            serviceAccountEmail,
          },
        },
      },
    };
  })();

  const token = ScriptApp.getOAuthToken();
  const options = {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = UrlFetchApp.fetch(apiUrl, options);
  const responseData = JSON.parse(response.getContentText());
  console.log(responseData);
}

function appendResultToSheet(bodyJson) {
  const sheet = SpreadsheetApp.getActive().getActiveSheet();
  const lastRow = sheet.getLastRow();
  const range = sheet.getRange(lastRow + 1, 1);
  range.setValue(JSON.stringify(bodyJson));
}

function doPost(e) {
  const bodyJson = JSON.parse(e.postData.contents);
  appendResultToSheet(bodyJson);
  return ContentService.createTextOutput('ok');
}
