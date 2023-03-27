const { body, param } = require("express-validator");
const paramIdInt = param("id").isInt().withMessage("id Should be Integer")
const paramisMongoId = param("id").isMongoId().withMessage("id Should be MongoId");
const addressPost = [
    body("address")
        .isObject()
        .withMessage("Addres Should Be Object"),
    body("address.city")
        .isString()
        .withMessage("city Should Be string"),
    body("address.street").optional()
        .isString()
        .withMessage("street Should Be string"),
    body("address.building").optional()
        .isInt()
        .withMessage("building Should Be integer")
   ]
const phonePost =[
    body("phone").optional()
    .isMobilePhone('ar-EG')
    .withMessage("phone Should Be a Valid Phone Number")
    .isLength({ min: 10, max: 14, })
    .withMessage("phone length should be between 10 and 14 numbers")
]
const addressUpdate = [
    body("address")
        .isObject().optional()
        .withMessage("Addres Should Be Object"),
    body("address.city")
        .isString().optional()
        .withMessage("city Should Be string"),
    body("address.street").optional()
        .isString()
        .withMessage("street Should Be string"),
    body("address.building").optional()
        .isInt()
        .withMessage("building Should Be integer")
   ]
const phoneUpdate =[
    body("phone").optional()
    .isMobilePhone('ar-EG')
    .withMessage("phone Should Be a Valid Phone Number")
    .isLength({ min: 10, max: 14, })
    .withMessage("phone length should be between 10 and 14 numbers")
]
const userInfoPost = [
    body("name").isString()
        .withMessage("Name Shoud be string"),
    body("gender").isIn(["female", "male"])
        .withMessage("Gender Shoud be One Of ('female','male')"),
    body("age").optional().isInt()
        .withMessage("Age is required"),
    body("email").isEmail()
        .withMessage("Email is required ,Email shoud be like example@email.com"),
    body("password")
        .isString()
        .withMessage("password is required"),
]
const userInfoUpdate = [
    body("name").optional()
        .isString()
        .withMessage("Name Shoud be string"),
    body("gender").optional().isIn(["female", "male"])
        .withMessage("Gender Shoud be One Of ('female','male')"),
    body("age").optional().isInt()
        .withMessage("Age is required"),
    body("email").optional().isEmail()
        .withMessage("Email is required ,Email shoud be like example@email.com"),
    body("password").optional()
        .isString()
        .withMessage("password is required"),

]
//-------------------------Patient-----------------------------//
exports.patientPost = [
   ...userInfoPost,
   ...phonePost,
   ...addressPost
]
exports.patientUpdate = [
    paramIdInt,
    ...userInfoUpdate,
    ...addressUpdate,
    ...phoneUpdate
]
//-------------------------clinic-----------------------------//
exports.clinicPost =
    [
        body("name").isAlpha().withMessage("name should be string")
            .isLength({ max: 20 }).withMessage("length of name less than 20"),
        body("email").isEmail().withMessage("Enter a valid email"),
        body("location").isString().withMessage("Location should be string"),
        body("speciality").isIn(['cardiology', 'dentistry', 'ENT', 'dermatology', 'nutrition']),
        body("medicines").optional().isArray(),
        body("doctors").optional().isArray(),
        body("employees").optional().isArray()
    ]
exports.clinicUpdate =
    [
        paramIdInt,
        body("name").optional().isAlpha().withMessage("name should be string")
            .isLength({ max: 20 }).withMessage("length of name less than 20"),
        body("email").optional().isEmail().withMessage("Enter a valid email"),
        body("location").optional().isString().withMessage("Location should be string"),
        body("speciality").optional().isIn(['cardiology', 'dentistry', 'ENT', 'dermatology', 'nutrition']),
        body("medicines").optional().isArray(),
        body("doctors").optional().isArray(),
        body("employees").optional().isArray()
    ]
//-------------------------invoice-----------------------------//   
exports.invoicePost =
    [
        body("paymentType").isIn(['Cash', 'Credit Card', ' Insurance Card'])
            .withMessage("Payment Type should be cash or credit card or Insurance Card "),
        body("totalCost").isNumeric().withMessage("Total cost should be number"),
        body("date").isDate().withMessage("Please Enter Invalid Date"),
        body("doctor").isNumeric().withMessage("Doctor ID should be number"),
        body("patient").isNumeric().withMessage("Patient ID should be number")
    ]
exports.invoiceUpdate =
    [
        paramIdInt,
        body("paymentType").optional().isIn(['Cash', 'Credit Card', ' Insurance Card'])
            .withMessage("Payment Type should be cash or credit card or Insurance Card "),
        body("totalCost").optional().isNumeric().withMessage("Total cost should be number"),
        body("date").optional().isDate().withMessage("Please Enter Invalid Date"),
        body("doctor").optional().isNumeric().withMessage("Doctor ID should be number"),
        body("patient").optional().isNumeric().withMessage("Patient ID should be number")
    ]

//-------------------------calender-----------------------------//
exports.calenderPost = [
    body("date")
        .isDate().withMessage("date Should be date"),
        body("startAt")
        .isString().withMessage("startAt Should be time"),
        body("endAt")
        .isString().withMessage("endAt Should be time"),
]
exports.calenderUpdate = [
    body("date")
        .optional()
        .isDate().withMessage("weekday Should be date"),
    body("startAt")
        .optional()
        .isString().withMessage("startAt Should be time"),
    body("endAt")
        .optional()
        .isString().withMessage("endAt Should be time"),
]
//-------------------------appointment-----------------------------//
exports.appointmentPost = [
    body("date")
        .isDate().withMessage("date Should be date"),
    body("doctor")
        .isInt().withMessage("doctor Should be Integer"),
    body("startAt")
        .isString().withMessage("startAt Should be time"),
]
exports.appointmentUpdate = [
  
    body("startAt")
        .optional()
        .isString().withMessage("startAt Should be time"),
    body("date").optional()
    .isDate().withMessage("date Should be date"),
]

//-------------------------employee-----------------------------//

exports.employeePost=[
    body("birthDate").isString().withMessage("Please Enter Valid Date"),
    body("salary").isNumeric().withMessage("Salary should be number"),
    body("clinicId").isNumeric().withMessage("clinicId sould be Number"),
    ...phonePost,
    ...addressPost,
    ...userInfoPost,
]


exports.employeeUpdate=[
    body("birthDate").optional().isString().withMessage("Please Enter Valid Date"),
    body("salary").isNumeric().optional().withMessage("Salary should be number"),
    body("clinicId").isNumeric().withMessage("clinicId sould be Number"),
    ...addressUpdate,
    ...phoneUpdate,
    ...userInfoUpdate 
]
//-------------------------doctors-----------------------------//
exports.doctorPost = [
    ...userInfoPost,
    ...phonePost,
    ...addressPost,
    body("image").isString().optional() .withMessage("image is required"),
    body("speciality")
        .isIn([
            "cardiology",
            "dentistry",
            "ear",
            "nose",
            "throat",
            "ENT",
            "nutrition",
            "dermatology",
        ])
        .withMessage(
            "Only Valid Specialties are : cardiology,dentistry,ear,nose,throat,nutrition,dermatology"
        ),
    body("yearsOfExperience")
        .isNumeric()
        .withMessage("Year of Experience should be number"),
    body("clinicId")
    .optional().isNumeric().withMessage("Clinic id should be number"),
    body("price")
    .optional().isNumeric().withMessage("Price must be integer")
];

exports.updateDoctor = [
    paramIdInt,
    ...addressUpdate,
    ...phoneUpdate,
    ...userInfoUpdate ,
    body("image").isString().optional() .withMessage("image is required"),
    body("speciality")
        .optional()
        .isIn([
            "cardiology",
            "dentistry",
            "ear",
            "nose",
            "throat",
            "ENT",
            "nutrition",
            "dermatology",
        ])
        .withMessage(
            "Only Valid Specialties are : cardiology,dentistry,ear,nose,throat,nutrition,dermatology"
        ),
    body("calender").optional().isArray().withMessage("(Calender of the doctor must be array"),
    body("clinicId").optional().isNumeric().withMessage("Clinic id should be number"),
    body("appointmentId").optional().isArray().withMessage("Appointments should be array"),
    body("price").optional().isNumeric().withMessage("Price must be integer")
];

exports.medicinePost = [
    body("drugName").isString().withMessage("drug name should be string.....")
        .isLength({ max: 30 }).withMessage("name max length 30 alpha.."),
    body("dosage").isString().withMessage("Dosage should be string.....")
        .isLength({ min: 3 }).withMessage("Dosage should be with length 6 or more....."),
    body("description").isString().withMessage("description should be string.....")
        .isLength({ min: 6 }).withMessage("description should be with length 6 or more....."),
    body("form").isIn(["cap", "susp", "jugs", "cream", "Eye_Drops", "tab"]).withMessage("form should be in cap, susp ,jugs, cream, Eye_Drops ,tab..."),
    body("price").isInt({ min: 1 }).withMessage("price should be int....."),
    body("quantity").isInt({ min: 1 }).withMessage("price should be int....."),
    body("mfd_date").optional().isDate().withMessage("mfd_date should be date....."),
    body("exp_date").isDate().withMessage("Exp_date should be date.....")
        .isAfter(new Date().toLocaleDateString("en-US").replace(/\//g, "-")).withMessage('Exp-date should be after Today ...'),
];
exports.medicineUpdate = [
    paramIdInt,
    body("drugName").optional().isString().withMessage("drug name should be string.....")
        .isLength({ max: 30 }).withMessage("name max length 30 alpha.."),
    body("dosage").optional().isString().withMessage("Dosage should be string.....")
        .isLength({ min: 3 }).withMessage("Dosage should be with length 6 or more....."),
    body("description").optional().isString().withMessage("description should be string.....")
        .isLength({ min: 6 }).withMessage("description should be with length 6 or more....."),
    body("form").optional().isIn(["cap", "susp", "jugs", "cream", "Eye_Drops", "tab"]).withMessage("form should be in cap, susp ,jugs, cream, Eye_Drops ,tab..."),
    body("price").optional().isInt({ min: 1 }).withMessage("price should be int....."),
    body("quantity").optional().isInt({ min: 1 }).withMessage("price should be int....."),
    body("mfd_date").optional().isDate().withMessage("mfd_date should be date....."),
    body("exp_date").optional().isDate().withMessage("Exp_date should be date.....")
        .isAfter(new Date().toLocaleDateString("en-US").replace(/\//g, "-")).withMessage('Exp-date should be after Today ...'),

];

//-------------------------Update Status----------------------//
exports.updateStatus = [
    paramIdInt,
    body("status").optional().isIn(['blocked','pending','active','deactivated'])
        .withMessage("status Shoud be One Of ('blocked','pending','active','deactivated')"),
]
exports.paramIdInt = paramIdInt 
exports.paramisMongoId =  paramisMongoId 