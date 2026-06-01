import { Request, Response } from "express";
import * as model from "./realEstateModel";
import axios from "axios";

export async function createProperty(req: Request & { user?: any }, res: Response) {
  try {
    const ownerId = req.body.owner_id || req.user?.id;
    if (!ownerId) return res.status(400).json({ message: "owner_id required" });

    // if creating for another user, require admin
    if (ownerId !== req.user?.id && req.user?.role !== "ADMIN") {
      return res.status(403).json({ message: "Admin required to create property for other users" });
    }

    const payload = {
      owner_id: ownerId,
      title: String(req.body.title || "Untitled property"),
      address: req.body.address || null,
      description: req.body.description || null,
      metadata: req.body.metadata || null,
    };

    const created = await model.createProperty(payload as any);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Failed to create property" });
  }
}

export async function getProperty(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    const p = await model.getPropertyById(id);
    if (!p) return res.status(404).json({ message: "Not found" });
    res.json(p);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Failed to fetch property" });
  }
}

export async function listProperties(req: Request & { user?: any }, res: Response) {
  try {
    const ownerId = String(req.query.ownerId || req.user?.id);
    if (!ownerId) return res.status(400).json({ message: "ownerId required" });
    const list = await model.listPropertiesByOwner(ownerId);
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Failed to list properties" });
  }
}

export async function addValuation(req: Request & { user?: any }, res: Response) {
  try {
    const propertyId = String(req.params.id);
    const prop = await model.getPropertyById(propertyId);
    if (!prop) return res.status(404).json({ message: "Property not found" });

    // only owner or admin
    if (String(prop.owner_id) !== String(req.user?.id) && req.user?.role !== "ADMIN") {
      return res.status(403).json({ message: "Not allowed" });
    }

    const val = await model.addValuation({
      property_id: propertyId,
      amount: Number(req.body.amount),
      currency: req.body.currency || "INR",
      recorded_at: req.body.recorded_at || new Date().toISOString(),
      source: req.body.source || null,
      notes: req.body.notes || null,
    } as any);

    res.status(201).json(val);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Failed to add valuation" });
  }
}

export async function listValuations(req: Request, res: Response) {
  try {
    const propertyId = String(req.params.id);
    const vals = await model.listValuations(propertyId);
    res.json(vals);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Failed to list valuations" });
  }
}

export async function addRental(req: Request & { user?: any }, res: Response) {
  try {
    const propertyId = String(req.params.id);
    const prop = await model.getPropertyById(propertyId);
    if (!prop) return res.status(404).json({ message: "Property not found" });

    if (String(prop.owner_id) !== String(req.user?.id) && req.user?.role !== "ADMIN") {
      return res.status(403).json({ message: "Not allowed" });
    }

    const rent = await model.addRental({
      property_id: propertyId,
      amount: Number(req.body.amount),
      currency: req.body.currency || "INR",
      start_date: req.body.start_date || null,
      end_date: req.body.end_date || null,
      tenant: req.body.tenant || null,
      recorded_at: req.body.recorded_at || new Date().toISOString(),
    } as any);

    res.status(201).json(rent);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Failed to add rental" });
  }
}

export async function listRentals(req: Request, res: Response) {
  try {
    const propertyId = String(req.params.id);
    const rents = await model.listRentals(propertyId);
    res.json(rents);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Failed to list rentals" });
  }
}

export async function investorPortfolio(req: Request & { user?: any }, res: Response) {
  try {
    const investorId = String(req.params.investorId || req.user?.id);
    if (!investorId) return res.status(400).json({ message: "investorId required" });

    const properties = await model.listPropertiesByOwner(investorId);

    const enriched = await Promise.all(properties.map(async (p) => {
      const latestVal = await model.getLatestValuation(p.id as string);
      const rentalSum = await model.sumRentalIncome(p.id as string);
      return {
        property: p,
        latestValuation: latestVal,
        totalRentalIncome: rentalSum,
      };
    }));

    // attempt to fetch downstream holdings (best-effort)
    const mfPromise = axios.get(`${process.env.MF_URL}/api/users/${investorId}/holdings`).then(r => r.data).catch(() => null);
    const stocksPromise = axios.get(`${process.env.STOCKS_URL}/users/${investorId}/holdings`).then(r => r.data).catch(() => null);

    const [mfHoldings, stockHoldings] = await Promise.all([mfPromise, stocksPromise]);

    const realEstateTotal = enriched.reduce((s: number, e: any) => s + Number(e.latestValuation?.amount || 0), 0);
    const otherTotal = (mfHoldings?.totalValue || 0) + (stockHoldings?.totalValue || 0);

    const totalWealth = realEstateTotal + Number(otherTotal || 0);

    res.json({
      investorId,
      realEstate: enriched,
      mutualFunds: mfHoldings,
      stocks: stockHoldings,
      totals: { realEstateTotal, otherTotal, totalWealth },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Failed to compute portfolio" });
  }
}
