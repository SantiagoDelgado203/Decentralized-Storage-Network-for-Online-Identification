import { Criteria, TestUserInfo } from "./Models";

const EXPRESS_HOST_ADDRESS = "http://localhost:5000"


/*------------------------------------NET ENDPOINT-----------------------------------------*/
/**Funtions to forwards stuff to the network */

export async function uploadUserData(user_info: TestUserInfo)
{
  //package to be sent
  const payload = {
    //user identifier
    UID: "1",
    //user information in json string format
    user_data: user_info,
  }
    const res = await fetch(EXPRESS_HOST_ADDRESS + "/api/net/upload", {
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
export async function register(payload :{username: string, email: string, password: string, salt: string}){

  const res = await fetch(EXPRESS_HOST_ADDRESS + "/api/db/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  
  const reply = await res.json();

  return reply
  
}

/**check credentials (db/login)*/
export async function login(payload: {username: string,  hash: string}){

  const res = await fetch(EXPRESS_HOST_ADDRESS + "/api/db/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  
  const reply = await res.json();

  return reply

  return
}

/**for verifiers use (example, facebook requests a verification from a user) (db/request-verification)*/
export async function requestVerification(payload : {userID: string, verifierID: string, company: string, criteria: Criteria}){

  const res = await fetch(EXPRESS_HOST_ADDRESS + "/api/db/request-verification", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  
  const reply = await res.json();

  return reply
}
 /** to get all requests associated with an user or verifier, to diplay them in their dashboards */
export async function getRequests(ids : {userID?: string, verifierID?: string}){

  const res = await fetch(EXPRESS_HOST_ADDRESS + "/api/db/get-requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ids)
  });

  return await res.json();
}

/** to update the status field in a request, used by the user as a reply to a request */
export async function resolveRequest(payload : {requestID: string, accepted: boolean}){

  const res = await fetch(EXPRESS_HOST_ADDRESS + "/api/db/resolve-requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload)
  });

  return await res.json();
}

/** to modify an existing request, from a verifier */
export async function updateRequest(payload : {requestID: string, criteria: Criteria, status: string}){
  
  const res = await fetch(EXPRESS_HOST_ADDRESS + "/api/db/update-request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload)
  });

  return await res.json();
}