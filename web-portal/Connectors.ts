import { Criteria, TestUserInfo } from "./Models";

const EXPRESS_HOST_ADDRESS = "http://localhost:5000"


/*------------------------------------NET ENDPOINT-----------------------------------------*/
/**Funtions to forwards stuff to the network */

export async function sendUserData(user_info: TestUserInfo)
{
  //package to be sent
  const payload = {
    //user identifier
    UID: "1",
    //user information in json string format
    user_data: user_info,
  }
    const res = await fetch(EXPRESS_HOST_ADDRESS + "/api/net/user-info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return data.reply
}

// for user use (example, user has accepted verification)
export async function verify(userID: string){
  return
}

/*------------------------------------DB ENDPOINT-----------------------------------------*/
/*Funtions to create/read/update/delete stuff from the SQL database */

/**create new account (db/register)*/
export async function register(username: string, hash: string, salt: string ){

  return
}

/**check credentials (db/login)*/
export async function login(username: string,  hash: string){
  return
}

/**for verifiers use (example, facebook requests a verification from a user) (db/request-verification)*/
export async function requestVerification(userID: string, verifierID: string, company: string, criteria: Criteria){

  const payload = {
    userID: userID,
    verifierID: verifierID,
    company: company,
    criteria: criteria
  }

  const res = await fetch(EXPRESS_HOST_ADDRESS + "/api/db/request-verification", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  
  const data = await res.json();

  return data
}