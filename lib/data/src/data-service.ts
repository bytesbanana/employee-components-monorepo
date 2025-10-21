import data from "./data.json";
import { Response } from "./types";

export async function fetchEmployees(): Promise<Response> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  const response = JSON.parse(JSON.stringify(data)) as Response;
  return response.slice(0, 25)
}

export function filterEmployees(employees: Response, query: string): Response {
  if (!query || query.length < 2) return [];

  const lowerQuery = query.toLowerCase();

  return employees.filter((item) => {
    const emp = item.employee;
    const email = emp.department.manager.contact.email;

    return (
      emp.name.toLowerCase().includes(lowerQuery) ||
      emp.id.toLowerCase().includes(lowerQuery) ||
      email.toLowerCase().includes(lowerQuery)
    );
  });
}
