import { Criteria, UploadRequest } from "./Models";

const EXPRESS_HOST_ADDRESS = "http://localhost:5000"


/*------------------------------------NET ENDPOINT-----------------------------------------*/
/**Funtions to forwards stuff to the network */

export async function uploadUserData(payload: UploadRequest)
{
  const res = await fetch(EXPRESS_HOST_ADDRESS + "/api/net/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  //demonstration verification 1 
  await requestVerification({
    userID: payload.UserID, 
    verifierID: "ee97f730-d04a-432e-a6e3-39ed98262565", 
    company: "Testing Company 1", 
    criteria: {
      Type: "AND",
      Criteria: [
        {
          Type: "Rule",
          Field: "Name",
          Operation: "equals",
          Value: payload.Data.Name
        },
        {
          Type: "Rule",
          Field: "Age",
          Operation: "minimum",
          Value: "18"
        }
      ]
    },
    comment: "We want to verify your name matches " + payload.Data.Name + ", and that you are minimum 18 years old."
  })

  //demonstration verification 2
  await requestVerification({
    userID: payload.UserID, 
    verifierID: "a7a2d0fd-c172-4e37-84e6-3bbee6ab14ce", 
    company: "Testing Company 2", 
    criteria: {
      Type: "AND",
      Criteria: [
        {
          Type: "Rule",
          Field: "Address",
          Operation: "equals",
          Value: payload.Data.Address
        }
      ]
    },
    comment: "We want to verify your address matches " + payload.Data.Address + "."
  })

  //demonstration verification 3
  await requestVerification({
    userID: payload.UserID, 
    verifierID: "38071383-cd47-405d-b2e6-dfe34a00b5f5", 
    company: "Testing Company 3", 
    criteria: {
      Type: "AND",
      Criteria: [
        {
          Type: "Rule",
          Field: "Age",
          Operation: "maximum",
          Value: "18"
        }
      ]
    },
    comment: "We want to verify if you age is less than 18 years old."
  })

  //demonstration verification 4
  await requestVerification({
    userID: payload.UserID, 
    verifierID: "911c8dea-e3d6-4683-823d-2d05a60ccf6a", 
    company: "Testing Company 4", 
    criteria: {
      Type: "AND",
      Criteria: [
        {
          Type: "Rule",
          Field: "Gender",
          Operation: "equals",
          Value: "M"
        }
      ]
    },
    comment: "We want to verify if your gender is Male."
  })

  //demonstration verification 5
  await requestVerification({
    userID: payload.UserID, 
    verifierID: "6658f6f7-9fa4-4469-91ba-ed5a5b95ff8e", 
    company: "Testing Company 5", 
    criteria: {
      Type: "AND",
      Criteria: [
        {
          Type: "Rule",
          Field: "Gender",
          Operation: "equals",
          Value: "F"
        }
      ]
    },
    comment: "We want to verify if your gender is Female"
  })

  return data.reply
}

// for user use (example, user has accepted verification)
export async function verify(payload: {requestid: string, userID: string, criteria: Criteria}){
  const res = await fetch(EXPRESS_HOST_ADDRESS + "/api/net/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  return data.reply
  
}


/*------------------------------------DB ENDPOINT-----------------------------------------*/
/*Funtions to create/read/update/delete stuff from the SQL database */

/**create new account (db/register)*/
export async function register_user(payload :{email: string, password: string}){

  const res = await fetch(EXPRESS_HOST_ADDRESS + "/api/db/register-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  
  const reply = await res.json();

  return reply
  
}

export async function register_provider(payload :{email: string, password: string, companyname: string}){

  const res = await fetch(EXPRESS_HOST_ADDRESS + "/api/db/register-verifier", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  
  const reply = await res.json();

  return reply
  
}

/**check credentials and create JWT (db/login)*/
export async function login(payload: {email: string,  password: string}){
  const res = await fetch(EXPRESS_HOST_ADDRESS + "/api/db/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  
  const reply = await res.json();

  return reply
}

export async function logout(){
  const res = await fetch(EXPRESS_HOST_ADDRESS + "/api/db/logout", {
    method: "POST",
    credentials: "include",
  });
  
  const reply = await res.json();

  return reply
}

/**for verifiers use (example, facebook requests a verification from a user) (db/request-verification)*/
export async function requestVerification(payload : {userID: string, verifierID: string, company: string, criteria: Criteria, comment: string}){

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

