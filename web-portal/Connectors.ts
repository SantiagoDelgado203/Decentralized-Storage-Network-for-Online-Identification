import { TestUserInfo } from "./Models";

export async function sendUserData(user_info: TestUserInfo)
{
  //package to be sent
  const payload = {
    //user information in json string format
    user_data: JSON.stringify(user_info),
    //
    admin_signature: "foo"
  }
    const res = await fetch("http://localhost:5000/api/user-info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return data.reply
}