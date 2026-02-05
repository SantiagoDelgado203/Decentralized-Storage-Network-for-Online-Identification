export type TestUserInfo = {
    Name: string,
    DOB: DOB,
    Address: string
}

export type TestRequest = {
    userID: string,
    verifierID: string,
    criteria: any
}

type DOB = {
    year: number,
    month: number,
    day: number
}

export type Rule = {
    Field: string,
    Type: "equal" | "greater" | "less" | "in" 
    value: any
}

export type Criteria = {
    All: Rule[],
    Any: Rule[]
}

export type UserInfo = {
    Name: string,
    Gender: string,
    DOB: DOB,
    Address: string
}