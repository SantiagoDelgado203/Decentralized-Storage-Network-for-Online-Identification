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