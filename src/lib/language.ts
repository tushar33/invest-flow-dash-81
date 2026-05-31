/**
 * Centralized user-facing copy for the entire frontend.
 */

export const LANG = {
  brand: {
    name: "Trinity Arrows",
    tagline: "Global Exports",
    adminConsole: "Admin Console",
    member: "Member",
    copyright: (year: number) => `© ${year} Trinity Arrows. All rights reserved.`,
    heroImageAlt: "Fresh fruits at export warehouse",
    socialLinkAria: "Social link",
    menuAria: "Menu",
  },

  common: {
    error: "Error",
    cancel: "Cancel",
    approve: "Approve",
    reject: "Reject",
    confirmReject: "Confirm Reject",
    retry: "Retry",
    all: "All",
    user: "User",
    status: "Status",
    type: "Type",
    manual: "Manual",
    reason: "Reason",
    saving: "Saving…",
    processing: "Processing...",
    submitting: "Submitting...",
    updating: "Updating...",
    rejecting: "Rejecting...",
    verifying: "Verifying...",
    assigning: "Assigning...",
    cancelling: "Cancelling...",
    validationError: "Validation Error",
    noData: "—",
    hiddenBalance: "••••••",
    search: "Search",
    email: "Email",
    phone: "Phone",
    city: "City",
    name: "Name",
    role: "Role",
    profile: "Profile",
    signOut: "Sign Out",
    signIn: "Sign In",
    viewProfile: "View Profile",
    adminProfile: "Admin Profile",
    switchToAdmin: "Switch to Admin",
    memberView: "Member View",
    edit: "Edit",
    view: "View",
    close: "Close",
    verify: "Verify",
    update: "Update",
    add: "Add",
    request: "Request",
    subject: "Subject",
    message: "Message",
    office: "Office",
    documents: "Documents",
    required: "Required",
    viewAll: "View all",
    learnMore: "Learn More",
    joinUs: "Join Us",
    exploreProducts: "Explore Products",
    contactSales: "Contact Sales",
    sendInquiry: "Send Inquiry",
    openPdf: "Open PDF",
    documentUploaded: "Document uploaded",
    uploadDocument: "Upload document",
    uploadHint: "PDF or image, max 2 MB",
    tapToReplace: "Tap to replace (PDF or image, max 2 MB)",
    fileSizeKb: (size: number) => `${size} KB · tap to replace`,
    documentAlt: (label: string) => `${label} document`,
    ref: "Ref:",
    credit: "CREDIT",
    debit: "DEBIT",
    balance: "Balance",
    actions: "Actions",
    yes: "Yes",
    no: "No",
    showAll: "Show All",
    loadActivity: "Load Activity",
    selectUser: "Select User",
    fixErrorsBelow: "Please fix the errors below",
    passwordPlaceholder: "••••••••",
    amountPlaceholder: "0",
    fullName: "Full Name",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmNewPassword: "Confirm New Password",
    changePassword: "Change Password",
    saveChanges: "Save Changes",
    updatePassword: "Update Password",
    personalDetails: "Personal Details",
    memberSince: (date: string) => `Member since ${date}`,
    showingEntries: (count: number) =>
      count === 1 ? `Showing ${count} entry` : `Showing ${count} entries`,
  },

  nav: {
    dashboard: "Dashboard",
    home: "Home",
    about: "About",
    products: "Products",
    services: "Services",
    contact: "Contact",
    plans: "Plans",
    packages: "Packages",
    activity: "Activity",
    ledger: "Ledger",
    redemptions: "Redemptions",
    redeem: "Redeem",
    payouts: "Payouts",
    accountDetails: "Account Details",
    users: "Users",
    rewardLogs: "Reward Logs",
    simulator: "Simulator",
    settings: "Settings",
  },

  filter: {
    title: "Filters",
    reset: "Reset",
    resetFilters: "Reset Filters",
    apply: "Apply",
    clear: "Clear",
    searchPlaceholder: "Search...",
    selectDate: "Select date",
    fromDate: "From Date",
    toDate: "To Date",
    startDate: "Start date",
    endDate: "End date",
    sourceType: "Source Type",
    runType: "Run Type",
    activityType: "Activity Type",
    allTypes: "All Types",
    allRoles: "All Roles",
    allModes: "All Modes",
    rewardPercent: "Reward %",
    userSearch: "User Search",
    userSearchPlaceholder: "User ID...",
    searchByUserIdPlaceholder: "Search by user ID...",
    nameOrEmailPlaceholder: "Name or email...",
    autoRedemption: "Auto Redemption",
  },

  status: {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    active: "Active",
    inactive: "Inactive",
    completed: "Completed",
    closed: "Closed",
    success: "Success",
    failed: "Failed",
    verified: "Verified",
    none: "None",
    half: "Half",
    full: "Full",
    cron: "Cron",
    verificationPending: "Verification Pending",
    verificationRejected: "Verification Rejected",
    setupRequired: "Setup Required",
    redemptionReady: "Redemption Ready",
  },

  role: {
    user: "User",
    admin: "Admin",
  },

  auth: {
    loginFailed: "Login failed",
    registrationFailed: "Registration failed",
    missingContact: "Missing contact",
    missingContactDescription: "Provide an email or phone number",
    loginHeroTitle: "A premium credit experience built for clarity.",
    loginHeroDescription:
      "Track your balance, monitor rewards and request redemptions — all from one elegant dashboard.",
    signInPrompt: "Sign in to access your dashboard",
    identifierLabel: "Email, username, or phone",
    identifierPlaceholder: "you@example.com or TA-1234567",
    password: "Password",
    signingIn: "Signing in...",
    noAccount: "Don't have an account?",
    createOne: "Create one",
    registerHeroTitle: "Start earning credits in minutes.",
    registerHeroDescription:
      "Create your account and your administrator will assign your first plan. Watch rewards arrive on schedule.",
    createAccount: "Create Account",
    registerSubtitle: "Join the credit platform in seconds",
    fullNamePlaceholder: "John Doe",
    emailPlaceholder: "you@example.com",
    phonePlaceholder: "10-digit number",
    cityPlaceholder: "e.g. Mumbai",
    passwordMinPlaceholder: "Min 6 characters",
    creatingAccount: "Creating account...",
    hasAccount: "Already have an account?",
    loginFeatures: [
      { title: "Real-time balance", desc: "See every credit movement instantly" },
      { title: "Smart rewards", desc: "Watch reward cycles compound" },
      { title: "Secure & private", desc: "Bank-grade encryption" },
    ],
    registerFeatures: [
      { title: "Zero hidden fees", desc: "Transparent reward cycles" },
      { title: "Watch it grow", desc: "Live cycle tracking" },
      { title: "Verified accounts", desc: "Encrypted account details" },
    ],
    enterIdentifier: "Enter your email, phone, or username",
    requestFailed: (status: number) => `Request failed (${status})`,
  },

  dashboard: {
    goodMorning: "Good morning",
    goodAfternoon: "Good afternoon",
    goodEvening: "Good evening",
    fallbackName: "User",
    availableBalance: "Available Balance",
    requestRedemption: "Request Redemption",
    totalContribution: "Total Contribution",
    totalRewards: "Total Rewards",
    pendingRedemption: "Pending Redemption",
    activePlans: "Active Plans",
    redemptionReadyDescription: "Account details verified. You can request redemptions.",
    updateDetailsPrompt: "Update your account details to request redemptions.",
    underReviewPrompt: "Your account details are under review.",
    addDetailsPrompt: "Add account details to enable redemptions.",
    viewDetails: "View Details",
    addNow: "Add Now",
    recentActivity: "Recent Activity",
    noActivityYet: "No activity yet",
    noActivityDescription: "Your reward credits and redemptions will appear here.",
  },

  bank: {
    account: "Bank account",
    current: "Current",
    saving: "Saving",
    savings: "Savings",
    noDetailsOnFile: "No bank details on file",
    title: "Account Details",
    subtitle: "Required for redemptions",
    addAccount: "Add Account",
    requiredBannerTitle: "Account Details Required",
    requiredBannerDescription: "You must add your account details before requesting a redemption.",
    addAccountTitle: "Add Account",
    updateAccountTitle: "Update Account",
    formHint: "All fields are mandatory. Please enter details exactly as per your records.",
    saveAccountDetails: "Save Account Details",
    accountHolderName: "Account Holder Name",
    accountHolderNamePlaceholder: "Full name as per bank records",
    bankName: "Bank Name",
    bankNamePlaceholder: "e.g. State Bank of India",
    accountNumber: "Account Number",
    accountNumberPlaceholder: "Enter account number",
    confirmAccountNumber: "Confirm Account Number",
    confirmAccountPlaceholder: "Re-enter account number",
    ifscCode: "IFSC Code",
    ifscPlaceholder: "e.g. SBIN0001234",
    accountType: "Account Type",
    aadharNumber: "Aadhar Number",
    aadharPlaceholder: "12-digit Aadhar number",
    aadharDocument: "Aadhar Document",
    panNumber: "PAN Number",
    panPlaceholder: "e.g. ABCDE1234F",
    panDocument: "PAN Document",
    accountHolder: "Account Holder",
    accountNo: "Account No.",
    ifsc: "IFSC",
    aadhar: "Aadhar",
    pan: "PAN",
    rejectionReason: "Rejection reason",
    underReviewRedemption: "Your account details are under review. Redemptions will be available once verified.",
    refreshForStatus: "Refresh this page to check for updates.",
    rejectedResubmit: "Your account details were rejected. Please update and resubmit.",
    updateAndResubmit: "Please update your details and resubmit.",
    documentRequired: "Document upload is required",
    invalidFileType: "Only PDF and image files (JPG, PNG, WEBP) are allowed",
    fileTooLarge: "File size must be 2 MB or less",
    accountMismatch: "Account numbers do not match",
    invalidAadhar: "Enter a valid 12-digit Aadhar number",
    invalidPan: "Enter a valid PAN (e.g. ABCDE1234F)",
    saved: "Account details saved",
  },

  redemption: {
    title: "Redemption Approvals",
    subtitle: "Review and process redemption requests",
    pageTitle: "Redemptions",
    pageSubtitle: "Request & track redemptions",
    request: "Redemption Request",
    auto: "Auto Redemption",
    principal: "Principal",
    roi: "ROI",
    rejectionReasonPlaceholder: "Rejection reason...",
    noneFound: "No redemptions found",
    processed: "Redemption processed",
    requested: "Redemption requested",
    windowSettings: "Redemption Window Settings",
    enableTimeValidation: "Enable Redemption Time Validation",
    windowStart: "Window Start",
    windowEnd: "Window End",
    windowOpen: "Redemption Window Open",
    windowClosed: "Redemption Window Closed",
    windowHours: "Redemption requests accepted between",
    windowTimeRange: "9:00 AM – 12:00 PM",
    newRequest: "New Redemption Request",
    amountDeducted: "Amount will be deducted from your balance",
    addDetailsFirst: "Please add account details before requesting a redemption.",
    addBankAccount: "Add Bank Account",
    rejectedBeforeRequest:
      "Your account details were rejected. Please update and resubmit before requesting a redemption.",
    updateAccountDetails: "Update Account Details",
    viewAccountDetails: "View Account Details",
    amountCredits: "Amount (Credits)",
    account: "Account",
    queuedMessage: "Request will be queued and processed in the next redemption window.",
    submitRequest: "Submit Redemption Request",
    invalidAmount: "Enter a valid amount",
    requestsTitle: "Redemption Requests",
    noRequests: "No redemption requests",
    noRequestsDescription: "Your redemption history will appear here.",
    label: "Redemption",
  },

  reward: {
    credit: "Reward Credit",
    logs: "Reward Logs",
    logsSubtitle: "Track reward cycles & trigger processing",
    process: "Process Rewards",
    processed: "Rewards Processed",
    rewardRun: "Reward Run",
    cyclesSuffix: "cycles",
    cyclesProgress: (completed: number, total: number) => `${completed}/${total} cycles`,
    noneFound: "No reward logs found",
    percent: "Reward %",
    engine: "Reward Engine",
    engineDescription: "Configure how reward cycles are scheduled for newly assigned plans.",
    cycleDays: "Days Between Reward Cycles",
    perCycle: "/cycle",
    rewardCycleLabel: (percent: number, amount: string) => `${percent}% Reward · ${amount}/cycle`,
  },

  cycle: {
    schedulingMode: "Cycle Scheduling Mode",
    fixedDays: "Fixed Days",
    calendarMonthly: "Calendar Monthly",
    daysBetweenCycles: "Days Between Cycles",
    fixedDaysHelp: "Cycles run after a fixed number of days.",
    calendarMonthlyHelp: "Cycles run on the same date every month.",
    calendarMonthlyNotice: "Reward cycles will run on the same calendar date each month.",
    fixedDaysRequired: "Days between cycles is required when using Fixed Days mode.",
    fixedDaysMin: "Days between cycles must be greater than 0.",
    nextCycleDate: "Next Cycle Date",
    lastCycleDate: "Last Cycle Date",
    cycleMode: "Cycle Mode",
    cycleDate: "Cycle Date",
    fixedDaysInterval: (days: number) => `Every ${days} days`,
    calendarMonthlyDescription: "Same calendar date each month",
  },

  simulator: {
    title: "Reward Simulator",
    subtitle: "Preview reward schedules before assigning a plan to a member.",
    run: "Run Simulation",
    running: "Simulating…",
    emptyTitle: "No simulation yet",
    emptyDescription: "Enter plan details and run a simulation to preview cycle dates and amounts.",
    loadError: "Simulation failed. Please check your inputs and try again.",
    principalAmount: "Contribution Amount",
    rewardPercent: "Reward Percentage",
    startDate: "Plan Start Date",
    autoPayMode: "Auto Redemption Mode",
    month: "Month",
    rewardCredit: "Reward Credit",
    balanceAdjustment: "Balance Adjustment",
    remainingBalance: "Remaining Balance",
    autoPayPayout: "Auto Redemption",
    walletNet: "Wallet Credit",
    validationWarnings: "Validation warnings",
    validationPassed: "All validation checks passed.",
    previewForUser: (name: string) => `Previewing schedule for ${name}`,
    previewHint: "Review the cycle schedule below, then assign the plan from Users when ready.",
    totalCycles: "Total Cycles",
    monthlyBenefit: "Monthly Benefit",
    maturityDate: "Maturity Date",
    totalRewards: "Total Rewards",
    totalAutoPay: "Total Auto Redemption",
    walletAfterAutoPay: "Wallet After Auto Redemption",
    useSettingsDefaults: "Use system defaults",
    invalidPrincipal: "Enter a valid contribution amount greater than zero.",
    previewSchedule: "Preview Schedule",
  },

  plans: {
    myPlans: "My Plans",
    assignedByAdmin: "Assigned by administrator",
    noneFound: "No plans found",
    noneDescription: "Plans assigned by your administrator will appear here.",
    contribution: "Contribution",
    monthlyBenefit: "Monthly Benefit",
    remainingBalance: "Remaining Balance",
    cyclesCompleted: "Cycles completed",
    assigned: "Assigned",
    nextReward: "Next Reward",
    nextCycleDate: "Next Cycle Date",
    lastCycleDate: "Last Cycle Date",
    cycleMode: "Cycle Mode",
    adminTitle: "Plans",
    filteredByUser: "Filtered by user",
    allAssigned: "All assigned plans",
    rewardLabel: "Reward:",
    cyclesLabel: "Cycles:",
    nextRewardLabel: "Next Reward:",
    assignedLabel: "Assigned:",
    viewLedger: "View Ledger",
    editDate: "Edit Date",
    cancelPlan: "Cancel Plan",
    cannotEditTooltip: "Cannot edit after reward cycles are processed",
    editDateTooltip: "Edit assignment date",
    onlyActiveCancelTooltip: "Only active plans can be cancelled",
    cancelPlanTooltip: "Cancel this plan",
    editAssignmentDate: "Edit Assignment Date",
    userLabel: "User:",
    contributionLabel: "Contribution:",
    cyclesCompletedLabel: "Cycles completed:",
    newAssignmentDate: "New Assignment Date",
    editDateHint: "Only allowed when no reward cycles have been processed.",
    updateDate: "Update Date",
    cancelConfirmTitle: "Cancel Plan",
    cancelConfirmDescription: "Are you sure you want to cancel this plan?",
    keepPlan: "No, keep it",
    yesCancelPlan: "Yes, cancel plan",
    selectRewardPercent: "Select Reward %",
    contributionAmount: "Contribution Amount (Credits)",
    contributionPlaceholder: "e.g. 100000",
    rewardPercentage: "Reward Percentage",
    assignPlan: "Assign Plan",
    assignPlanTo: (name: string) => `Assign a new plan to ${name}`,
  },

  wallet: {
    activityTitle: "Activity",
    activitySubtitle: "Reward credits & redemption activity",
    ledgerTitle: "Ledger",
    activityLedgerTitle: "Activity / Ledger",
    activityForPlan: (id: string) => `Activity for plan ${id}`,
    ledgerSubtitle: "Complete activity history and balance summary.",
    availableBalance: "Available Balance",
    totalCredited: "Total Credited",
    totalRedeemed: "Total Redeemed",
    totalCredits: "Total Credits",
    totalDebits: "Total Debits",
    activityHistory: "Activity History",
    noActivity: "No activity found",
    noActivityFilters: "Try adjusting your filters or check back later.",
    noEntriesFilters: "No entries match your current filters.",
  },

  profile: {
    autoRedemption: "Auto Redemption",
    autoRedemptionMode: "Auto Redemption Mode",
    autoRedemptionHint: "Auto Redemption mode is configured by the administrator.",
    currentPasswordPlaceholder: "Enter current password",
    confirmPasswordPlaceholder: "Re-enter new password",
    passwordsMismatch: "Passwords do not match",
    addressAndNominee: "Address & Nominee",
    dateOfBirth: "Date of Birth",
    address: "Address",
    state: "State",
    district: "District",
    pincode: "Pincode",
    nomineeName: "Nominee Name",
    nomineeRelation: "Nominee Relation",
    dateOfBirthPlaceholder: "YYYY-MM-DD",
    addressPlaceholder: "Street, area, landmark",
    statePlaceholder: "e.g. Maharashtra",
    districtPlaceholder: "e.g. Pune",
    pincodePlaceholder: "6 digits",
    nomineeNamePlaceholder: "Full name",
    nomineeRelationPlaceholder: "e.g. Spouse, Parent",
    invalidPincode: "Pincode must be exactly 6 digits.",
  },

  admin: {
    dashboardTitle: "Admin Dashboard",
    dashboardSubtitle: "System overview",
    totalUsers: "Total Users",
    totalContribution: "Total Contribution",
    totalRewards: "Total Rewards",
    pendingRedemptions: "Pending Redemptions",
    activePlans: "Active Plans",
    currentLiability: "Current Liability",
    recentUsers: "Recent Users",
    plansSuffix: (n: number) => `${n} plans`,
    usersTitle: "Users",
    usersSubtitle: "Manage platform users",
    noUsers: "No users found",
    verifyBankDetails: "Verify Bank Details",
    verifyBankFor: (name: string) => `Review bank and KYC information for ${name}`,
    bankLoadFailed: "Failed to load bank details.",
    noBankSubmitted: "This user has not submitted bank details yet.",
    verificationStatus: "Verification status",
    accountHolder: "Account holder",
    bankName: "Bank name",
    accountNumber: "Account number",
    ifscCode: "IFSC code",
    accountType: "Account type",
    aadharNumber: "Aadhar number",
    panNumber: "PAN number",
    aadharDocument: "Aadhar document",
    panDocument: "PAN document",
    rejectReasonPlaceholder: "Explain why the bank details were rejected...",
    viewPlans: "View Plans",
    assignPlanAction: "Assign Plan",
    autoRedemptionMode: "Auto Redemption Mode",
  },

  settings: {
    title: "Settings",
    subtitle: "Configure payout windows and reward cycle timing.",
    saved: "Settings saved",
    savedDescription: "Your configuration has been updated successfully.",
    loadFailed: "Failed to load settings",
    saveFailed: "Failed to save settings",
    empty: "No system settings found. Run the backend seed script to create defaults.",
    save: "Save Settings",
    windowDescription: "Control when users are allowed to request redemptions (IST).",
    restrictWindow: "Restrict redemptions to the configured time window.",
    windowHint: "Users can only request redemptions during this time window when validation is enabled.",
    startBeforeEnd: "Start time must be before end time.",
    cycleDaysMin: "Days between reward cycles must be at least 1.",
  },

  toast: {
    profileUpdated: "Profile updated",
    addressDetailsUpdated: "Address & nominee details updated",
    passwordUpdated: "Password updated",
    planAssigned: "Plan assigned successfully",
    planAssignFailed: "Failed to assign plan",
    planCancelled: "Plan cancelled successfully",
    planCancelBlocked: "Cannot cancel plan after rewards started",
    autoRedemptionUpdated: "Auto Redemption mode updated",
    autoRedemptionFailed: "Failed to update Auto Redemption",
    actionFailed: "Action failed",
    bankVerified: "Bank details verified",
    bankRejected: "Bank details rejected",
    inquirySent: "Inquiry sent",
    inquirySentDescription: "Thanks! We'll get back to you shortly.",
  },

  errors: {
    notFoundCode: "404",
    notFoundTitle: "Oops! Page not found",
    returnHome: "Return to Home",
    blankAppTitle: "Welcome to Your Blank App",
    blankAppDescription: "Start building your amazing project here!",
  },

  transaction: {
    redemption: "Redemption",
    balanceAdjustment: "Balance Adjustment",
    credits: "Credits",
    creditsCompact: "CR",
  },

  public: {
    footerDescription:
      "Premium global fruit import & export company delivering farm-fresh produce across international markets.",
    company: "Company",
    getInTouch: "Get in Touch",
    privacy: "Privacy",
    terms: "Terms",
    contactEmail: "info@trinityarrows.com",
    contactAddress: "123 Trade Avenue, Mumbai, India",
    contactUs: "Contact Us",
    getInTouchTitle: "Get in Touch",
    contactSubtitle: "Have an inquiry or partnership opportunity? We'd love to hear from you.",
    heroBadge: "Trusted by 200+ global partners since 1998",
    heroTitlePrefix: "Global Fruit",
    heroTitleHighlight: "Import & Export",
    heroTitleSuffix: "Solutions",
    heroDescription:
      "Delivering premium quality produce across international markets — sourced from the world's finest orchards, shipped with precision.",
    ourProduce: "Our Produce",
    featuredFruits: "Featured Fruits",
    featuredFruitsDescription: "Hand-picked, quality-assured fruits from the world's best growers.",
    whatWeDo: "What We Do",
    exportServices: "Export Services",
    exportServicesDescription: "Complete supply-chain solutions tailored for the fresh produce industry.",
    whyChoose: "Why Choose Trinity Arrows",
    whyChooseTitle: "The trusted name in",
    whyChooseHighlight: "global fruit trade",
    whyChooseDescription:
      "With over two decades of expertise, we combine deep agricultural knowledge with world-class logistics to deliver excellence.",
    globalReach: "Global Reach",
    globalReachTitle: "Serving 50+ countries worldwide",
    globalReachDescription: "Our export network spans every major market — from North America to Asia-Pacific.",
    testimonialsSection: "Testimonials",
    testimonialsTitle: "Trusted by leading partners",
    ctaTitle: "Ready to grow your export business?",
    ctaDescription:
      "Join Trinity Arrows and access fresh produce from around the world. Premium quality, guaranteed.",
    ourCatalog: "Our Catalog",
    premiumProduce: "Premium Produce",
    premiumProduceDescription: "Hand-picked, quality-assured fruits sourced from the world's best growers.",
    aboutUs: "About Us",
    aboutHeroPrefix: "Trinity Arrows — your trusted",
    aboutHeroHighlight: "global export partner",
    aboutHeroDescription:
      "For over two decades, Trinity Arrows has connected growers, distributors, and retailers across continents — built on trust, quality, and reliability.",
    ourStory: "Our Story",
    ourStoryTitle: "Two decades of global excellence",
    ourStoryP1:
      "From sun-ripened mangoes in India to crisp apples from Europe, Trinity Arrows ensures every shipment arrives fresh, on time, and to specification.",
    ourStoryP2:
      "Our extensive network spans 50+ countries, with cold-chain integrity maintained from farm to destination — single containers or year-round programs, we deliver consistency.",
    ourValues: "Our values drive everything",
    serviceItems: [
      { title: "Import & Export", desc: "End-to-end international trade services with seamless customs handling and documentation." },
      { title: "Packaging", desc: "Custom packaging solutions designed to preserve freshness and showcase brand identity." },
      { title: "Cold Storage", desc: "State-of-the-art temperature-controlled warehouses across key strategic locations." },
      { title: "Logistics", desc: "Reliable cold-chain transport via sea, air, and road networks globally." },
      { title: "Distribution", desc: "Wide distribution network reaching retailers, wholesalers, and HoReCa channels." },
    ],
    serviceItemsShort: [
      { title: "Import & Export", desc: "End-to-end international trade with seamless customs handling." },
      { title: "Packaging", desc: "Custom packaging that preserves freshness and brand identity." },
      { title: "Cold Storage", desc: "Temperature-controlled warehouses across key locations." },
      { title: "Logistics", desc: "Reliable cold-chain transport via sea, air, and road." },
      { title: "Distribution", desc: "Wide retail, wholesale, and HoReCa distribution network." },
    ],
    footerServices: ["Import & Export", "Packaging", "Cold Storage", "Logistics", "Distribution"],
    stats: [
      { value: "50+", label: "Countries Served" },
      { value: "200+", label: "Global Partners" },
      { value: "10K+", label: "Tonnes Shipped" },
      { value: "25+", label: "Years of Trust" },
    ],
    featuredProducts: [
      { name: "Mangoes", tag: "Premium • Alphonso, Kesar" },
      { name: "Apples", tag: "Crisp • Red & Green" },
      { name: "Grapes", tag: "Seedless • Vine-ripened" },
      { name: "Pomegranate", tag: "Ruby-red • Juicy Arils" },
      { name: "Citrus Fruits", tag: "Vitamin-rich • Oranges" },
      { name: "Seasonal Produce", tag: "Berries & More" },
      { name: "Dry Fruits", tag: "Almonds • Cashews • Dates" },
    ],
    catalogProducts: [
      { name: "Mangoes", desc: "Premium Alphonso, Kesar, and Banganapalli varieties — sweet, aromatic, and export-grade." },
      { name: "Apples", desc: "Crisp red and green apples sourced from premium orchards across Europe and Asia." },
      { name: "Grapes", desc: "Seedless green, red, and black grape varieties, vine-ripened to perfection." },
      { name: "Pomegranate", desc: "Ruby-red, antioxidant-rich pomegranates with sweet, juicy arils — export-grade Bhagwa variety." },
      { name: "Citrus Fruits", desc: "Vitamin-rich oranges, lemons, and mandarins from the finest groves worldwide." },
      { name: "Seasonal Produce", desc: "Berries, stone fruits, melons, and more — fresh in every season." },
      { name: "Dry Fruits", desc: "Premium almonds, cashews, pistachios, walnuts, raisins, and dates — sourced and packed for global markets." },
    ],
    whyChooseFeatures: [
      { title: "Quality Assured", desc: "Rigorous QC at every step." },
      { title: "Global Network", desc: "50+ countries of operation." },
      { title: "ISO Certified", desc: "International standards met." },
      { title: "On-time Delivery", desc: "99.5% reliability rate." },
    ],
    aboutValues: [
      { title: "Sustainability", desc: "Eco-conscious sourcing and packaging at every step." },
      { title: "Precision", desc: "Detail-oriented operations from origin to destination." },
      { title: "Integrity", desc: "Transparent dealings and consistent quality." },
    ],
    aboutStats: [
      { label: "50+ Countries" },
      { label: "200+ Partners" },
      { label: "ISO Certified" },
      { label: "Quality Guaranteed" },
    ],
    regions: [
      "United States", "Canada", "United Kingdom", "Germany",
      "France", "Netherlands", "UAE", "Saudi Arabia",
      "Singapore", "Japan", "Australia", "South Korea",
    ],
    testimonials: [
      {
        quote: "Trinity Arrows has been our trusted partner for over five years. Quality and consistency are unmatched.",
        name: "Sarah Mitchell",
        role: "Procurement Director, FreshMart UK",
      },
      {
        quote: "Their cold-chain logistics are world-class. Every shipment arrives in perfect condition, on time.",
        name: "Ahmed Al-Rashid",
        role: "CEO, Gulf Produce Trading",
      },
      {
        quote: "From sourcing to delivery, they handle everything seamlessly. A true global export partner.",
        name: "Hiroshi Tanaka",
        role: "Import Manager, Tokyo Fruits Co.",
      },
    ],
  },
} as const;

/** Reusable filter option sets */
export const FILTER_OPTIONS = {
  payoutStatus: [
    { label: LANG.status.pending, value: "PENDING" },
    { label: LANG.status.approved, value: "PROCESSED" },
    { label: LANG.status.rejected, value: "REJECTED" },
  ],
  payoutSourceType: [
    { label: LANG.common.manual, value: "MANUAL" },
    { label: LANG.redemption.auto, value: "AUTO_PAY" },
  ],
  planStatus: [
    { label: LANG.status.active, value: "ACTIVE" },
    { label: LANG.status.completed, value: "MATURED" },
  ],
  planStatusWithClosed: [
    { label: LANG.status.active, value: "ACTIVE" },
    { label: LANG.status.completed, value: "MATURED" },
    { label: LANG.status.closed, value: "CLOSED" },
  ],
  rewardPercent: [
    { label: "5%", value: "5" },
    { label: "7%", value: "7" },
    { label: "10%", value: "10" },
  ],
  runType: [
    { label: LANG.common.manual, value: "MANUAL" },
    { label: LANG.status.cron, value: "CRON" },
  ],
  runStatus: [
    { label: LANG.status.success, value: "SUCCESS" },
    { label: LANG.status.failed, value: "FAILED" },
  ],
  transactionType: [
    { label: LANG.reward.credit, value: "ROI" },
    { label: LANG.transaction.redemption, value: "PAYOUT_DEBIT" },
  ],
  ledgerType: [
    { label: LANG.reward.credit, value: "ROI" },
    { label: LANG.transaction.redemption, value: "PAYOUT_DEBIT" },
    { label: LANG.transaction.balanceAdjustment, value: "PRINCIPAL" },
  ],
  userRole: [
    { label: LANG.role.user, value: "USER" },
    { label: LANG.role.admin, value: "ADMIN" },
  ],
  autoPayMode: [
    { label: LANG.status.none, value: "NONE" },
    { label: LANG.status.half, value: "HALF" },
    { label: LANG.status.full, value: "FULL" },
  ],
} as const;

export const PUBLIC_NAV = [
  { to: "/", label: LANG.nav.home, end: true as const },
  { to: "/about", label: LANG.nav.about },
  { to: "/products", label: LANG.nav.products },
  { to: "/services", label: LANG.nav.services },
  { to: "/contact", label: LANG.nav.contact },
];

export function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return LANG.dashboard.goodMorning;
  if (h < 17) return LANG.dashboard.goodAfternoon;
  return LANG.dashboard.goodEvening;
}

export function accountTypeLabel(accountType?: string): string | null {
  const normalized = accountType?.toUpperCase();
  if (normalized === "CURRENT") return LANG.bank.current;
  if (normalized === "SAVING") return LANG.bank.saving;
  return null;
}

export function accountTypeDisplay(accountType?: string): string {
  return accountType === "current" ? LANG.bank.current : LANG.bank.savings;
}

export function payoutSourceLabel(sourceType?: string): string {
  return (sourceType || "MANUAL") === "AUTO_PAY" ? LANG.redemption.auto : LANG.common.manual;
}

export function requestTypeLabel(requestType: string): string {
  return requestType === "PRINCIPAL" ? LANG.redemption.principal : LANG.redemption.roi;
}

export function bankVerificationStatusLabel(status: "pending" | "verified" | "rejected"): string {
  if (status === "verified") return LANG.status.verified;
  if (status === "rejected") return LANG.status.rejected;
  return LANG.status.pending;
}

/** Legacy rows may use COMPLETED/APPROVED; canonical payout status is PROCESSED. */
export function normalizePayoutStatus(status: string): string {
  const upper = status.toUpperCase();
  if (upper === "COMPLETED" || upper === "APPROVED") return "PROCESSED";
  return upper;
}

export function payoutStatusBadge(status: string): "pending" | "approved" | "rejected" {
  const normalized = normalizePayoutStatus(status);
  if (normalized === "PROCESSED") return "approved";
  if (normalized === "REJECTED") return "rejected";
  return "pending";
}

export function payoutStatusLabel(status: string): string {
  const normalized = normalizePayoutStatus(status);
  if (normalized === "PROCESSED") return LANG.status.approved;
  if (normalized === "REJECTED") return LANG.status.rejected;
  if (normalized === "PENDING") return LANG.status.pending;
  return status;
}

export function planStatusLabel(status: string): string {
  if (status === "ACTIVE") return LANG.status.active;
  if (status === "MATURED") return LANG.status.completed;
  if (status === "CLOSED") return LANG.status.closed;
  return status;
}

export function autoPayModeLabel(mode: string): string {
  const normalized = mode?.toUpperCase();
  if (normalized === "HALF") return LANG.status.half;
  if (normalized === "FULL") return LANG.status.full;
  return LANG.status.none;
}

export function roleLabel(role: string): string {
  return role === "ADMIN" ? LANG.role.admin : LANG.role.user;
}

export function transactionTypeLabel(type: string): string {
  switch (type) {
    case "ROI_CREDIT":
    case "ROI":
      return LANG.reward.credit;
    case "PAYOUT_DEBIT":
      return LANG.transaction.redemption;
    case "PRINCIPAL_DEBIT":
    case "PRINCIPAL":
      return LANG.transaction.balanceAdjustment;
    default:
      return type.replace(/_/g, " ");
  }
}

export function directionLabel(direction: string): string {
  return direction === "CREDIT" ? LANG.common.credit : LANG.common.debit;
}

export function runStatusLabel(status: string): string {
  if (status === "SUCCESS") return LANG.status.success;
  if (status === "FAILED") return LANG.status.failed;
  return status;
}

export function runTypeLabel(runType: string): string {
  if (runType === "MANUAL") return LANG.common.manual;
  if (runType === "CRON") return LANG.status.cron;
  return runType;
}

export function userAccountStatusLabel(status?: string): string {
  if (!status) return LANG.common.noData;
  if (status.toUpperCase() === "ACTIVE") return LANG.status.active;
  if (status.toUpperCase() === "INACTIVE") return LANG.status.inactive;
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}
