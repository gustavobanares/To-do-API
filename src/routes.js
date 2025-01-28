import { randomUUID } from "node:crypto";
import { Database } from "./middlewares/database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  // Listar todas as tasks com busca opcional
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (request, response) => {
      const { search } = request.query;

      const tasks = database.select(
        "tasks",
        search
          ? (task) =>
              task.title.includes(search) || task.description.includes(search)
          : null
      );

      return response.end(JSON.stringify(tasks));
    },
  },

  // Criar uma nova task
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (request, response) => {
      const { title, description } = request.body;

      if (!title || !description) {
        return response
          .writeHead(400)
          .end(JSON.stringify({ error: "Title and description are required." }));
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null, // Inicialmente, null
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      database.insert("tasks", task);

      return response.writeHead(201).end();
    },
  },

  // Atualizar uma task existente
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (request, response) => {
      const { id } = request.params;
      const { title, description } = request.body;

      const task = database.update("tasks", id, {
        ...(title && { title }),
        ...(description && { description }),
        updated_at: new Date().toISOString(),
      });

      return response.writeHead(204).end();
    },
  },

  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (request, response) => {
      const { id } = request.params;
  
      // Verificar se a task com o ID existe
      const task = database.select("tasks").find((task) => task.id === id);
  
      if (!task) {
        // Se a task não existir, retornar 404
        return response.writeHead(404).end(JSON.stringify({ error: "Task not found" }));
      }
  
      // Alternar o estado de `completed_at`
      const isCompleted = !!task.completed_at; // true se já estiver concluída
      const updatedTask = {
        ...task,
        completed_at: isCompleted ? null : new Date(), // Alternar entre null e a data atual
        updated_at: new Date(), // Atualizar o campo `updated_at`
      };
  
      // Atualizar a task no banco de dados
      database.update("tasks", id, updatedTask);
  
      return response.writeHead(200).end();
    },
  },

  // Deletar uma task
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (request, response) => {
      const { id } = request.params;

      const task = database.delete("tasks", id);

      return response.writeHead(204).end();
    },
  },
];