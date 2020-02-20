const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

function findProject(projects, index){
    return projects.find(proj => proj.id == index);
};

function hasProject(req, res, next) {
    const { index } = req.params;
    const project = findProject(projects, index);
    
    if(!project) {
        return res.status(400).json({ error: 'Project not found!' });
    };

    return next();
};

function countRequests(req, res, next) {

    console.count("Número de requisições");
  
    return next();
};

server.use(countRequests);

server.get('/projects', (req, res) => {
    res.json(projects);
});

server.get('/projects/:index', hasProject, (req, res) => {
    const { index } = req.params;
    
    const project = findProject(projects, index);
    res.json(project);
});

server.post('/projects', (req, res) => {
    const { id, title } = req.body;

    projects.push({ 
        id, 
        title, 
        tasks: [] 
    });

    res.json({ projects });
});

server.post('/projects/:index/tasks', hasProject, (req, res) => {
    const { index } = req.params;
    const { title } = req.body;

    const project = findProject(projects, index);

    project.tasks.push(title);

    return res.json({ project });
});

server.put('/projects/:index', hasProject, (req, res) => {
    const { index } = req.params;
    const { title } = req.body;

    const project = findProject(projects, index);
    project.title = title;

    return res.json({ project });
});

server.delete('/projects/:index', hasProject, (req, res) => {
    const { index } = req.params;

    const projectId = projects.findIndex(proj => proj.id == index);
    
    projects.splice(projectId, 1);

    return res.send();
});


server.listen(3333);