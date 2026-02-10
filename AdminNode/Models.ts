export class Provider {
  providerid?: string;
  email: string;
  registeredname: string;
  hashedpassword: string;

  constructor(params: {
    providerid?: string;
    email: string;
    registeredname: string;
    hashedpassword: string;
  }) {
    this.providerid = params.providerid || "";
    this.email = params.email
    this.registeredname = params.registeredname;
    this.hashedpassword = params.hashedpassword;
  }
}

export class User {
  userid?: string;
  email: string;
  hashedpassword: string;

  constructor(params: {
    userid?: string;
    email: string;
    hashedpassword: string;
  }) {
    this.userid = params.userid || "";
    this.email = params.email;
    this.hashedpassword = params.hashedpassword;
  }
}

export class DB_Request {
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
