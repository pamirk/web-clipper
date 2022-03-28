/* eslint-disable */
const BASE_URL =
  "https://mycryptotestapp.azurewebsites.net/api/getTextRazorData?url=";

async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(BASE_URL + path);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function apiPost<T>(path: string, body: any): Promise<T> {
  const headers: {
    Accept: string;
    "Content-Type": string;
  } = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const response = await fetch(BASE_URL + path, {
    method: "post",
    headers,
    body: JSON.stringify(body),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}
// const fetcher: Fetcher = (url: string) => fetch(BASE_URL + url).then((r) => r.json())

export const getTextRazorData = async (url: string) =>
  await apiGet<any>(`${BASE_URL}${url}`);

export const saveIntoNotion = async (body: any) =>
  await apiPost<any>("/save", body);
