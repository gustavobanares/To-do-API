import { randomUUID } from "node:crypto";

export const routes = [
  {
    method: "GET",
    path: "/tasks",
    handler: (request, response) => {
      const { search } = request.query;

      const tasks = databas.select(
        "tasks",
        search
          ? {
              title: search,
              description: search,
            }
          : null
      );
      return response.end(JSON.stringify(tasks));
    },
  },

  {
    method: "POST",
    path: "/tasks",
    handler: (request, response) => {
      const { title, description } = request.body;

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at,
        created_at,
        update_at,
      };

      database.insert("task", task);

      return response.writeHead(201).end();
    },
  },

  {
    method: "PUT",
    path: "/tasks/:id",
    handler: (request, response) => {
      const { id } = request.params;
      const { title, description } = request.body;

      database.update("tasks", id, {
        title,
        description,
      })

      return response.writeHead(204).end();
    },
  },

  {
    method: "DELETE",
    path: "/tasks/:id",
    handler: (request, response) => {
      const { id } = request.params;

      database.delete("tasks", id)

      return response.writeHead(204).end();
    },
  },
];
