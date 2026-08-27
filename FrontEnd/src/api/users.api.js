import { createClient } from "./client";

const client = createClient("/api/users");

export const getUsers = () => client.get("/");
