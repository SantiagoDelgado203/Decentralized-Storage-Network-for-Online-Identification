export class Provider {
  providerid?: string;
  registeredname: string;
  hashedpassword: string;
  salt?: string;

  constructor(params: {
    providerid?: string;
    registeredname: string;
    hashedpassword: string;
    salt: string;
  }) {
    this.providerid = params.providerid || "";
    this.registeredname = params.registeredname;
    this.hashedpassword = params.hashedpassword;
    this.salt = params.salt;
  }
}

export class User {
  userid?: string;
  email: string;
  hashedpassword: string;
  salt?: string;

  constructor(params: {
    userid?: string;
    email: string;
    hashedpassword: string;
    salt: string;
  }) {
    this.userid = params.userid || "";
    this.email = params.email;
    this.hashedpassword = params.hashedpassword;
    this.salt = params.salt;
  }
}

export class Request {
  requestid?: string;
  providerid?: string;
  userid?: string;
  companyname: string;
  datarequests: unknown; // jsonb
  status: string;

  constructor(params: {
    requestid?: string;
    providerid: string;
    userid: string;
    companyname: string;
    datarequests: unknown;
    status: string;
  }) {
    this.requestid = params.requestid || "";
    this.providerid = params.providerid;
    this.userid = params.userid;
    this.companyname = params.companyname;
    this.datarequests = params.datarequests;
    this.status = params.status;
  }
}
