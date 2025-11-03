// src/controllers/serviceController.js

// src/controllers/serviceController.js
import Service from "../models/Service.js";
import User from "../models/user.js";

/**
 * 🧱 Create new service
 */
export const createService = async (req, res) => {
  try {
    const { title, description, price, unit, category, available } = req.body;
    const provider_id = req.user?.id || null;

    if (!title || !price || !category) {
      return res.status(400).json({ message: "Title, price, and category are required." });
    }

    const newService = await Service.create({
      title,
      description,
      price,
      unit: unit || "hour",
      category,
      available: available ?? true,
      provider_id,
    });

    res.status(201).json({
      message: "Service created successfully",
      service: newService,
    });
  } catch (error) {
    console.error("❌ Create Service Error:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * 📋 Get all services (alias for getAllServices)
 */
export const getServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      include: [
        {
          model: User,
          as: "provider",
          attributes: ["id", "full_name", "email", "role"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(services);
  } catch (error) {
    console.error("❌ Fetch Services Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Alias for routes using getAllServices
export const getAllServices = getServices;

/**
 * 🔍 Get a service by ID
 */
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id, {
      include: [
        {
          model: User,
          as: "provider",
          attributes: ["id", "full_name", "email", "role"],
        },
      ],
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(service);
  } catch (error) {
    console.error("❌ Fetch Service Error:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * ✏️ Update a service
 */
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    await service.update(updates);

    res.json({
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    console.error("❌ Update Service Error:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * 🗑️ Delete a service
 */
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    await service.destroy();
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("❌ Delete Service Error:", error);
    res.status(500).json({ error: error.message });
  }
};
