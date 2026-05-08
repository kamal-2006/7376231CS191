import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.TOKEN;

export const Log = async (
  stack: string,
  level: string,
  packageName: string,
  message: string
) => {
  try {
    const response = await axios.post(
      "http://20.244.56.144/evaluation-service/logs",
      {
        stack,
        level,
        package: packageName,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );

    console.log("Log Created:", response.data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.log("Logging Error:", message);
  }
};