import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildFunctionPath } from './utils/build-route-path.js'
import { parse } from 'csv-parse'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildFunctionPath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        title: search, 
        description: search
      } : null)

      return res.end(JSON.stringify(tasks))
    }
  },  
  {
    method: 'POST',
    path: buildFunctionPath('/tasks'),
    handler: (req, res) => {
      const {title, description} = req.body

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        update_at: new Date(),
      }
  
      database.insert('tasks', task)
      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildFunctionPath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      if (!title || !description) {
        return res.writeHead(400).end('title or description not found, verify and try again.')
      }

      const updated = database.update('tasks', id,{ 
        title, 
        description,
        update_at: new Date()
        }, )

      if (!updated) {
        return res.writeHead(404).end('task not found!')
      }

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildFunctionPath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params
      const completed_at = new Date()

      const updated = database.update('tasks', id,{
        completed_at
      })

      if (!updated) {
        return res.writeHead(404).end('task not found.')
      }

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildFunctionPath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      database.delete('tasks', id)
      return res.writeHead(204).end()
    }
  },

]