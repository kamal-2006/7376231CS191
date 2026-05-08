declare const process: {
  env?: {
    TOKEN?: string;
  };
};

const TOKEN = process.env?.TOKEN;

export const Log = async (
  stack: string,
  level: string,
  packageName: string,
  message: string
) => {
  try {
    const response = await fetch(
      "http://20.244.56.144/evaluation-service/logs",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN ?? ""}`,
        },
        body: JSON.stringify({
          stack,
          level,
          package: packageName,
          message,
        }),
      }
    );

    const responseBody = await response.json();
    console.log("Log Created:", responseBody);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.log("Logging Error:", errorMessage);
  }
};