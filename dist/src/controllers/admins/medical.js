"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMedicals = exports.getMedicalById = exports.deleteMedicalCategory = exports.getMedicalCategoryById = exports.updateCategoryMedical = exports.createMedical = exports.createMedicalCategory = exports.getMedicalCategories = void 0;
const schema_1 = require("../../models/schema");
const db_1 = require("../../models/db");
const response_1 = require("../../utils/response");
const drizzle_orm_1 = require("drizzle-orm");
const Errors_1 = require("../../Errors");
const getMedicalCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield db_1.db.select().from(schema_1.categoryMedical);
    (0, response_1.SuccessResponse)(res, { categoriesMedical: data }, 200);
});
exports.getMedicalCategories = getMedicalCategories;
const createMedicalCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    yield db_1.db.insert(schema_1.categoryMedical).values(data);
    (0, response_1.SuccessResponse)(res, { message: "Category Medical Created Successfully" }, 201);
});
exports.createMedicalCategory = createMedicalCategory;
const createMedical = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    // Validate required fields
    if (!data.email) {
        return res.status(400).json({ message: "Email is required" });
    }
    if (!data.categoryIds || !Array.isArray(data.categoryIds) || data.categoryIds.length === 0) {
        return res.status(400).json({ message: "At least one category ID is required" });
    }
    if (!data.describtion) {
        return res.status(400).json({ message: "Description is required" });
    }
    try {
        // Find user by email
        const [user] = yield db_1.db
            .select()
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.email, data.email));
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Validate all categories exist
        const categories = yield Promise.all(data.categoryIds.map((categoryId) => __awaiter(void 0, void 0, void 0, function* () {
            const [category] = yield db_1.db
                .select()
                .from(schema_1.categoryMedical)
                .where((0, drizzle_orm_1.eq)(schema_1.categoryMedical.id, categoryId));
            if (!category) {
                throw new Error(`Category with ID ${categoryId} not found`);
            }
            return category;
        })));
        // Create a single medical record
        const [insertResult] = yield db_1.db.insert(schema_1.Medicals).values({
            userId: user.id,
            describtion: data.describtion,
        });
        const medicalId = insertResult.insertId;
        if (!medicalId) {
            throw new Error('Failed to create medical record');
        }
        // Create category associations
        yield db_1.db.insert(schema_1.medicalCategories).values(data.categoryIds.map(categoryId => ({
            medicalId: medicalId,
            categoryId: categoryId,
        })));
        // Handle images if provided
        if (data.images && data.images.length > 0) {
            const imageRecords = yield Promise.all(data.images.map((imagePath) => __awaiter(void 0, void 0, void 0, function* () {
                const path = yield saveBase64Image(imagePath, uuid(), req, "medicalImages");
                return {
                    medicalId: medicalId,
                    imagePath: path
                };
            })));
            yield db_1.db.insert(schema_1.MedicalImages).values(imageRecords);
        }
        // Get the created medical record with its categories
        const [medical] = yield db_1.db
            .select({
            id: schema_1.Medicals.id,
            userId: schema_1.Medicals.userId,
            describtion: schema_1.Medicals.describtion,
            status: schema_1.Medicals.status,
        })
            .from(schema_1.Medicals)
            .where((0, drizzle_orm_1.eq)(schema_1.Medicals.id, medicalId));
        // Get associated categories
        const associatedCategories = yield db_1.db
            .select({
            categoryId: schema_1.medicalCategories.categoryId,
        })
            .from(schema_1.medicalCategories)
            .where((0, drizzle_orm_1.eq)(schema_1.medicalCategories.medicalId, medicalId));
        (0, response_1.SuccessResponse)(res, {
            message: "Medical record created successfully",
            medical: Object.assign(Object.assign({}, medical), { categories: associatedCategories })
        }, 201);
    }
    catch (error) {
        if (error.message.startsWith('Category with ID')) {
            return res.status(404).json({ message: error.message });
        }
        console.error("Error creating medical record:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createMedical = createMedical;
const updateCategoryMedical = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [categorymedical] = yield db_1.db
        .select()
        .from(schema_1.categoryMedical)
        .where((0, drizzle_orm_1.eq)(schema_1.categoryMedical.id, id));
    if (!categorymedical)
        throw new Errors_1.NotFound("Category Medical Not Found");
    yield db_1.db.update(schema_1.categoryMedical).set(req.body).where((0, drizzle_orm_1.eq)(schema_1.categoryMedical.id, id));
    (0, response_1.SuccessResponse)(res, { message: "Country Updated Successfully" }, 200);
});
exports.updateCategoryMedical = updateCategoryMedical;
const getMedicalCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [categorymedical] = yield db_1.db
        .select()
        .from(schema_1.categoryMedical)
        .where((0, drizzle_orm_1.eq)(schema_1.categoryMedical.id, id));
    if (!categorymedical)
        throw new Errors_1.NotFound("Category Medical Not Found");
    (0, response_1.SuccessResponse)(res, { categorymedical }, 200);
});
exports.getMedicalCategoryById = getMedicalCategoryById;
const deleteMedicalCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [categorymedical] = yield db_1.db
        .select()
        .from(schema_1.categoryMedical)
        .where((0, drizzle_orm_1.eq)(schema_1.categoryMedical.id, id));
    if (!schema_1.categoryMedical)
        throw new Errors_1.NotFound("Category Medical Not Found");
    yield db_1.db.delete(schema_1.categoryMedical).where((0, drizzle_orm_1.eq)(schema_1.categoryMedical.id, id));
    (0, response_1.SuccessResponse)(res, { message: "Category Medical Deleted Successfully" }, 200);
});
exports.deleteMedicalCategory = deleteMedicalCategory;
// get all medical 
/*export const getAllMedicals = async (req: Request, res: Response) => {
  try {
    // Get all medical records
    const medicals = await db.select({
       // Medical record fields
        medicalId: Medicals.id,
        userId: Medicals.userId,
        categoryId: Medicals.categoryId,
        describtion: Medicals.describtion,
        
        // User fields
        userEmail: users.email,
        
        // Category fields
        categoryTitle: categoryMedical.title,

    }).from(Medicals)
      .leftJoin(users, eq(Medicals.userId, users.id))
      .leftJoin(categoryMedical, eq(Medicals.categoryId, categoryMedical.id));;

    // Get all medical images grouped by medical_id
    const images = await db.select().from(MedicalImages);
    const imagesByMedicalId = images.reduce((acc, image: any) => {
      if (!acc[image.medicalId]) {
        acc[image.medicalId] = [];
      }
      acc[image.medicalId].push(image);
      return acc;
    }, {} as Record<number, typeof images>);

    // Combine medical records with their images
    const medicalsWithImages = medicals.map(medical => ({
      ...medical,
      images: imagesByMedicalId[medical.id] || []
    }));

    SuccessResponse(res, { medicals: medicalsWithImages }, 200);
  } catch (error) {
    console.error("Error fetching medical records:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};*/
/*export const getAllMedicals = async (req: Request, res: Response) => {
  try {
    // Get all medical records with user info
    const medicals = await db
      .select({
        id: Medicals.id,
        userId: Medicals.userId,
        describtion: Medicals.describtion,
        userEmail: users.email,
      })
      .from(Medicals)
      .leftJoin(users, eq(Medicals.userId, users.id));

     
    // Get all category associations
    const medicalCategories = await db
      .select({
        categoryId: categoryMedical.id,
        categoryTitle: categoryMedical.title,
      })
      .from(categoryMedical)
      .leftJoin(categoryMedical, eq(categoryMedical.id, categoryMedical.id));

    // Get all medical images
    const images = await db.select().from(MedicalImages);
    const imagesByMedicalId = images.reduce((acc, image:any) => {
      if (!acc[image.medicalId]) acc[image.medicalId] = [];
      acc[image.medicalId].push(image);
      return acc;
    }, {} as Record<number, typeof images>);

    // Group categories by medicalId
    const categoriesByMedicalId = medicalCategories.reduce((acc, mc: any) => {
      if (!acc[mc.medicalId]) acc[mc.medicalId] = [];
      acc[mc.medicalId].push({
        categoryId: mc.categoryId,
        categoryTitle: mc.categoryTitle,
      });
      return acc;
    }, {} as Record<number, Array<{ categoryId: number; categoryTitle: string }>>);

    // Combine everything
    const medicalsWithDetails = medicals.map(medical => ({
      id: medical.id,
      userId: medical.userId,
      userEmail: medical.userEmail,
      describtion: medical.describtion,
      categories: categoriesByMedicalId[medical.id] || [],
      images: imagesByMedicalId[medical.id] || [],
    }));

    SuccessResponse(res, { medicals: medicalsWithDetails }, 200);
  } catch (error) {
    console.error("Error fetching medical records:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};*/
const getMedicalById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        // Get the medical record
        const [medical] = yield db_1.db
            .select()
            .from(schema_1.Medicals)
            .where((0, drizzle_orm_1.eq)(schema_1.Medicals.id, id));
        if (!medical) {
            throw new Errors_1.NotFound("Medical Not Found");
        }
        // Get all images for this medical record
        const images = yield db_1.db
            .select()
            .from(schema_1.MedicalImages)
            .where((0, drizzle_orm_1.eq)(schema_1.MedicalImages.medicalId, id));
        // Combine the data
        const medicalWithImages = Object.assign(Object.assign({}, medical), { images });
        (0, response_1.SuccessResponse)(res, { medical: medicalWithImages }, 200);
    }
    catch (error) {
        if (error instanceof Errors_1.NotFound) {
            return res.status(404).json({ message: error.message });
        }
        console.error("Error fetching medical record:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getMedicalById = getMedicalById;
const getAllMedicals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const medicals = yield db_1.db
            .select({
            id: schema_1.Medicals.id,
            userId: schema_1.Medicals.userId,
            userName: schema_1.Medicals.fullName,
            userEmail: schema_1.users.email,
            phoneNumber: schema_1.Medicals.phoneNumber,
            describtion: schema_1.Medicals.describtion,
            status: schema_1.Medicals.status,
        })
            .from(schema_1.Medicals)
            .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.Medicals.userId, schema_1.users.id));
        // Get all medical categories associations
        const medicalCategoriesData = yield db_1.db
            .select()
            .from(schema_1.medicalCategories)
            .where((0, drizzle_orm_1.inArray)(schema_1.medicalCategories.medicalId, medicals.map(m => m.id)));
        // Get all unique category IDs from medical categories
        const uniqueCategoryIds = [...new Set(medicalCategoriesData.map(mc => mc.categoryId))];
        // Get all categories
        const categories = yield db_1.db
            .select()
            .from(schema_1.categoryMedical)
            .where((0, drizzle_orm_1.inArray)(schema_1.categoryMedical.id, uniqueCategoryIds));
        // Get all images for these medicals
        const images = yield db_1.db
            .select()
            .from(schema_1.MedicalImages)
            .where((0, drizzle_orm_1.inArray)(schema_1.MedicalImages.medicalId, medicals.map(m => m.id)));
        // Group images by medical ID
        const imagesByMedicalId = images.reduce((acc, img) => {
            if (!acc[img.medicalId])
                acc[img.medicalId] = [];
            acc[img.medicalId].push(img);
            return acc;
        }, {});
        // Combine and process medical records
        const medicalsWithDetails = medicals.map(medical => ({
            id: medical.id,
            userId: medical.userId,
            describtion: medical.describtion,
            status: medical.status,
            userName: medical.userName,
            userEmail: medical.userEmail,
            phoneNumber: medical.phoneNumber,
            categories: categories.filter(cat => medicalCategoriesData.some(mc => mc.medicalId === medical.id && mc.categoryId === cat.id)),
            images: imagesByMedicalId[medical.id] || [],
        }));
        // Group medicals by status
        const groupedMedicals = {
            pending: medicalsWithDetails.filter(m => m.status === 'pending'),
            accepted: medicalsWithDetails.filter(m => m.status === 'accepted'),
            history: medicalsWithDetails.filter(m => m.status === 'history')
        };
        (0, response_1.SuccessResponse)(res, { medicals: groupedMedicals }, 200);
    }
    catch (error) {
        console.error("Error fetching medical records:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getAllMedicals = getAllMedicals;
