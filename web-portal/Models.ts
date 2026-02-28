export type VerifyRequest = {
    userID: string,
    verifierID: string,
    company: string,
    criteria: any
}

export type DOB = {
    year: number,
    month: number,
    day: number
}

export type Address = {
    Address1: string,
    Address2: string,
    City: string,
    State: string,
    ZIP: string,
    Country: string
}

export type Rule = {
    Type: "Rule"
    Field: string,
    Operation: "equals" | "minimum" | "maximum"
    Value: string | Number
}

type LogicalExpression = {
    Type: "AND" | "OR",
    Criteria: Criteria[]
}

type NotExpression = {
    Type: "NOT",
    Criteria?: Criteria
}

export type Criteria = Rule | LogicalExpression | NotExpression

export type UserInfo = {
    Name: string,
    Gender: string,
    DOB: DOB,
    Address: string,
}

export type UploadRequest = {
    UserID: string,
    Data: UserInfo
}