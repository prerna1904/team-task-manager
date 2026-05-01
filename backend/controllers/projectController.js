const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  try {
    const project = await Project.create({ ...req.body, admin: req.user._id });
    res.json(project);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ admin: req.user._id }, { members: req.user._id }]
    }).populate('admin members', 'name email');
    res.json(projects);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.addMember = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { members: req.body.userId } },
      { new: true }
    );
    res.json(project);
  } catch (err) { res.status(500).json({ message: err.message }); }
};