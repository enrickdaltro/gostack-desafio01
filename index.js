const express = require('express');
const server = express();

server.use(express.json());

const projects = [];

// Global Middleware that checks how many req has been made
function reqRequest(req, res, next) {
    console.count('Requisições');

    return next();
}

server.use(reqRequest);
// Local Middleware that checks there is a project
function checkProject(req, res, next) {
    const { id } = req.params;
    const project = projects.find(project => project.id == id);

    if (!project) {
        return res.status(400).json({ error: 'Project is required' });
    }
    return next();
}

// Get all projects
server.get('/projects', (req, res) => {
    return res.json(projects);
});

// Create a project
server.post('/projects', (req, res) => {
    const { id, title } = req.body;

    const project = {
        id,
        title,
        tasks: []
    };

    projects.push(project);
    return res.json(projects);
});

// Change a project
server.put('/projects/:id', checkProject, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(project => project.id == id);

    project.title = title;

    return res.json(project);
});

// Delete a project
server.delete('/projects/:id', checkProject, (req, res) => {
    const { id } = req.params;

    const projectIndex = projects.findIndex(project => project.id == id);

    projects.splice(projectIndex, 1);

    return res.send();
});

// create a new taks on a project
server.post('/projects/:id/tasks', checkProject, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(project => project.id == id);

    project.tasks.push(title);

    // projects[id].tasks.push(title);

    return res.json(project);
});

server.listen(3000);
