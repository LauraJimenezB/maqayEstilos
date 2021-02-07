const sheetsId = process.env.REACT_APP_GOOGLE_SHEETS_FILE;
const token = process.env.REACT_APP_GOOGLE_SHEETS_ACCES_TOKEN;
const keySheetsBest =
  "https://sheet.best/api/sheets/84d587cf-fa76-40e1-98ba-6c4018dd92c2";

export const writeLike = (isLike, idPost, titlePost) => {
  const number = isLike ? 1 : -1;

  const data = {
    "Post ID": idPost,
    "Título de post": titlePost,
    Like: number,
    "Created at": new Date(),
  };
  return fetch(`${keySheetsBest}`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((r) => r.json())
    .then((data) => {
      // The response comes here
      console.log(data);
    })
    .catch((error) => {
      // Errors are reported there
      console.log(error);
    });
};

export const writeLikeGoogle = (like, idPost, titlePost) => {
  return fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetsId}/values/A2:B2:append?valueInputOption=USER_ENTERED`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        range: "A2:B2",
        majorDimension: "ROWS",
        values: [[idPost, titlePost]],
      }),
    }
  );
};

/* 

"range": string,
  "majorDimension": enum (Dimension),
  "values": [
    array
  ]
  

  "range": "Sheet1!A1:E1",
  "majorDimension": "ROWS",
  "values": [
    ["Door", "$15", "2", "3/15/2016"],
    ["Engine", "$100", "1", "3/20/2016"],
  ],
  */