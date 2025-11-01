import Service from "../models/serviceModel.js";

export const createService = async (req, res) => {
  try {
    const { title, description, price, category, unit } = req.body;
    const provider_id = req.user.id;

    const newService = await Service.create({
      title, description, price, category, unit, provider_id
    });

    res.status(201).json(newService);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll();
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.status(200).json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
