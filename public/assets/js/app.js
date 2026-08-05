const socket = io();

const joinModal = document.getElementById("joinModal");
const joinForm = document.getElementById("joinForm");
const nameInput = document.getElementById("nameInput");
const teamInput = document.getElementById("teamInput");
const joinChannelInput = document.getElementById("joinChannelInput");
const joinTeamField = document.getElementById("joinTeamField");
const joinChannelField = document.getElementById("joinChannelField");
const joinTeamChecklistTrigger = document.getElementById("joinTeamChecklistTrigger");
const joinTeamChecklistMenu = document.getElementById("joinTeamChecklistMenu");
const joinChannelChecklistTrigger = document.getElementById("joinChannelChecklistTrigger");
const joinChannelChecklistMenu = document.getElementById("joinChannelChecklistMenu");
const joinRoleSelect = document.getElementById("joinRoleSelect");
const joinRoleDropdown = document.getElementById("joinRoleDropdown");
const joinRoleTrigger = document.getElementById("joinRoleTrigger");
const joinRoleMenu = document.getElementById("joinRoleMenu");
const joinDirectAdminField = document.getElementById("joinDirectAdminField");
const joinDirectAdminInput = document.getElementById("joinDirectAdminInput");
const joinPasswordField = document.getElementById("joinPasswordField");
const joinPasswordInput = document.getElementById("joinPasswordInput");
const joinSubmitButton = joinForm?.querySelector("button[type='submit']");
const joinModalEyebrow = document.getElementById("joinModalEyebrow");
const joinModalTitle = document.getElementById("joinModalTitle");
const joinSubmitPrimaryButton = document.getElementById("joinSubmitPrimaryButton");
const joinPortalHelper = document.getElementById("joinPortalHelper");
const joinPortalLink = document.getElementById("joinPortalLink");
const realMembersButton = document.getElementById("realMembersButton");
const realMembersModal = document.getElementById("realMembersModal");
const realMembersCloseButton = document.getElementById("realMembersCloseButton");
const realMembersModalEyebrow = document.getElementById("realMembersModalEyebrow");
const realMembersModalTitle = document.getElementById("realMembersModalTitle");
const realMembersMeta = document.getElementById("realMembersMeta");
const realMembersForm = document.getElementById("realMembersForm");
const realMemberNameInput = document.getElementById("realMemberNameInput");
const realMemberPasswordInput = document.getElementById("realMemberPasswordInput");
const realMemberTeamPreview = document.getElementById("realMemberTeamPreview");
const realMemberChannelPreview = document.getElementById("realMemberChannelPreview");
const realMembersSubmitButton = document.getElementById("realMembersSubmitButton");
const realMembersPortalHelper = document.getElementById("realMembersPortalHelper");
const realMembersPortalLink = document.getElementById("realMembersPortalLink");

const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const fileInput = document.getElementById("fileInput");
const fileToggle = document.getElementById("fileToggle");
const codeModeDropdown = document.getElementById("codeModeDropdown");
const codeModeTrigger = document.getElementById("codeModeTrigger");
const codeModeMenu = document.getElementById("codeModeMenu");
const codeModeSelect = document.getElementById("codeModeSelect");
const emojiToggle = document.getElementById("emojiToggle");
const emojiPicker = document.getElementById("emojiPicker");
const gifToggle = document.getElementById("gifToggle");
const gifPicker = document.getElementById("gifPicker");
const gifSearchForm = document.getElementById("gifSearchForm");
const gifSearchInput = document.getElementById("gifSearchInput");
const gifSearchButton = document.getElementById("gifSearchButton");
const gifResultGrid = document.getElementById("gifResultGrid");
const messageList = document.getElementById("messageList");
const chatBodyShell = document.querySelector(".chat-body-shell");
const memberPresenceCard = document.getElementById("memberPresenceCard");
const memberSearchInput = document.getElementById("memberSearchInput");
const userList = document.getElementById("userList");
const privilegedList = document.getElementById("privilegedList");
const guestList = document.getElementById("guestList");
const onlineCount = document.getElementById("onlineCount");
const memberTotalCount = document.getElementById("memberTotalCount");
const memberOnlineCount = document.getElementById("memberOnlineCount");
const memberOfflineCount = document.getElementById("memberOfflineCount");
const privilegedTotalCount = document.getElementById("privilegedTotalCount");
const privilegedOnlineCount = document.getElementById("privilegedOnlineCount");
const privilegedOfflineCount = document.getElementById("privilegedOfflineCount");
const guestTotalCount = document.getElementById("guestTotalCount");
const guestOnlineCount = document.getElementById("guestOnlineCount");
const guestOfflineCount = document.getElementById("guestOfflineCount");
const typingIndicator = document.getElementById("typingIndicator");
const throttleNotice = document.getElementById("throttleNotice");
const notificationStack = document.getElementById("notificationStack");
const connectionStatus = document.getElementById("connectionStatus");
const messageTemplate = document.getElementById("messageTemplate");

const roomLabel = document.getElementById("roomLabel");
const roomTitle = document.getElementById("roomTitle");
const pinnedNotice = document.getElementById("pinnedNotice");
const pinnedNoticeText = document.getElementById("pinnedNoticeText");
const pinnedNoticeMeta = document.getElementById("pinnedNoticeMeta");
const pinnedNoticeClear = document.getElementById("pinnedNoticeClear");
const broadcastNotice = document.getElementById("broadcastNotice");
const broadcastNoticeText = document.getElementById("broadcastNoticeText");
const broadcastNoticeMeta = document.getElementById("broadcastNoticeMeta");
const broadcastNoticeClose = document.getElementById("broadcastNoticeClose");
const teamList = document.getElementById("teamList");
const teamCreateForm = document.getElementById("teamCreateForm");
const teamCreateInput = document.getElementById("teamCreateInput");
const channelList = document.getElementById("channelList");
const channelForm = document.getElementById("channelForm");
const channelInput = document.getElementById("channelInput");
const dmList = document.getElementById("dmList");
const liveChatRouteCard = document.getElementById("liveChatRouteCard");
const liveChatRouteList = document.getElementById("liveChatRouteList");
const liveChatFilterControls = document.getElementById("liveChatFilterControls");
const dmFilterControls = document.getElementById("dmFilterControls");
const backToChannelButton = document.getElementById("backToChannelButton");
const clearHistoryButton = document.getElementById("clearHistoryButton");
const mobileSidebarToggle = document.getElementById("mobileSidebarToggle");
const sidebarCloseButton = document.getElementById("sidebarCloseButton");
const mobileSidebarBackdrop = document.getElementById("mobileSidebarBackdrop");
const sidebarPanel = document.querySelector(".sidebar");

const profileAvatar = document.getElementById("profileAvatar");
const profileName = document.getElementById("profileName");
const profileRegisteredBadge = document.getElementById("profileRegisteredBadge");
const profileRole = document.getElementById("profileRole");
const profileStatus = document.getElementById("profileStatus");
const profileTeam = document.getElementById("profileTeam");
const profileChannel = document.getElementById("profileChannel");
const logoutButton = document.getElementById("logoutButton");
const adminPanel = document.getElementById("adminPanel");
const adminPanelTitle = document.getElementById("adminPanelTitle");
const adminPanelRole = document.getElementById("adminPanelRole");
const adminPanelHint = document.getElementById("adminPanelHint");
const adminList = document.getElementById("adminList");
const adminSettingsEntryLink = document.getElementById("adminSettingsEntryLink");
const adminSettingsPage = document.getElementById("adminSettingsPage");
const bulkDeleteWrap = document.getElementById("bulkDeleteWrap");
const bulkDeleteChecklist = document.getElementById("bulkDeleteChecklist");
const bulkDeleteScopeTrigger = document.getElementById("bulkDeleteScopeTrigger");
const bulkDeleteScopeMenu = document.getElementById("bulkDeleteScopeMenu");
const bulkDeleteLiveChatToggle = document.getElementById("bulkDeleteLiveChatToggle");
const bulkDeleteDmToggle = document.getElementById("bulkDeleteDmToggle");
const bulkDeleteActionButton = document.getElementById("bulkDeleteActionButton");
const accountSettingsToggle = document.getElementById("accountSettingsToggle");
const accountSettingsForm = document.getElementById("accountSettingsForm");
const accountSettingsWrap = accountSettingsToggle?.closest(".admin-settings-wrap") || null;
const broadcastMessageToggle = document.getElementById("broadcastMessageToggle");
const broadcastMessageForm = document.getElementById("broadcastMessageForm");
const broadcastMessageWrap = broadcastMessageToggle?.closest(".admin-settings-wrap") || null;
const broadcastMessageInput = document.getElementById("broadcastMessageInput");
const broadcastTeamChecklistTrigger = document.getElementById("broadcastTeamChecklistTrigger");
const broadcastTeamChecklistMenu = document.getElementById("broadcastTeamChecklistMenu");
const broadcastChannelChecklistTrigger = document.getElementById("broadcastChannelChecklistTrigger");
const broadcastChannelChecklistMenu = document.getElementById("broadcastChannelChecklistMenu");
const broadcastRoleChecklistTrigger = document.getElementById("broadcastRoleChecklistTrigger");
const broadcastRoleChecklistMenu = document.getElementById("broadcastRoleChecklistMenu");
const broadcastDurationInput = document.getElementById("broadcastDurationInput");
const broadcastSendStatusCard = document.getElementById("broadcastSendStatusCard");
const broadcastSendSummary = document.getElementById("broadcastSendSummary");
const broadcastSendMeta = document.getElementById("broadcastSendMeta");
const loginConfigToggle = document.getElementById("loginConfigToggle");
const loginConfigForm = document.getElementById("loginConfigForm");
const loginConfigWrap = loginConfigToggle?.closest(".admin-settings-wrap") || null;
const uploadConfigToggle = document.getElementById("uploadConfigToggle");
const uploadConfigForm = document.getElementById("uploadConfigForm");
const uploadConfigWrap = uploadConfigToggle?.closest(".admin-settings-wrap") || null;
const directAdminConfigToggle = document.getElementById("directAdminConfigToggle");
const directAdminConfigForm = document.getElementById("directAdminConfigForm");
const directAdminConfigWrap = directAdminConfigToggle?.closest(".admin-settings-wrap") || null;
const loginShowTeamToggle = document.getElementById("loginShowTeamToggle");
const loginShowChannelToggle = document.getElementById("loginShowChannelToggle");
const directAdminEnabledToggle = document.getElementById("directAdminEnabledToggle");
const loginTeamOptionsInput = document.getElementById("loginTeamOptionsInput");
const loginChannelOptionsInput = document.getElementById("loginChannelOptionsInput");
const uploadImageLimitInput = document.getElementById("uploadImageLimitInput");
const uploadVideoLimitInput = document.getElementById("uploadVideoLimitInput");
const uploadAudioLimitInput = document.getElementById("uploadAudioLimitInput");
const uploadFileLimitInput = document.getElementById("uploadFileLimitInput");
const directAdminDmButton = document.getElementById("directAdminDmButton");
const directAdminDmHint = document.getElementById("directAdminDmHint");
const settingsUsernameInput = document.getElementById("settingsUsernameInput");
const settingsPasswordInput = document.getElementById("settingsPasswordInput");
const adminGlobalOnlineTotal = document.getElementById("adminGlobalOnlineTotal");
const adminGlobalVisitorTotal = document.getElementById("adminGlobalVisitorTotal");
const adminGlobalMemberOnline = document.getElementById("adminGlobalMemberOnline");
const adminGlobalGuestOnline = document.getElementById("adminGlobalGuestOnline");
const adminGlobalStatsUpdatedAt = document.getElementById("adminGlobalStatsUpdatedAt");
const adminGlobalStatsSource = document.getElementById("adminGlobalStatsSource");
const adminGlobalStatsPeak = document.getElementById("adminGlobalStatsPeak");
const adminGlobalStatsSparkline = document.getElementById("adminGlobalStatsSparkline");
const teamNoticeText = document.getElementById("teamNoticeText");
const previewModal = document.getElementById("previewModal");
const previewFrame = document.getElementById("previewFrame");
const previewMeta = document.getElementById("previewMeta");
const previewCloseButton = document.getElementById("previewCloseButton");
const editModal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");
const editMessageInput = document.getElementById("editMessageInput");
const editCloseButton = document.getElementById("editCloseButton");
const editCancelButton = document.getElementById("editCancelButton");

const DEFAULT_TEAM = String(document.body?.dataset?.defaultTeamCode || "LOBBY")
  .trim()
  .toUpperCase() || "LOBBY";
const DEFAULT_CHANNEL = String(document.body?.dataset?.defaultChannelCode || "GENERAL")
  .trim()
  .toUpperCase() || "GENERAL";
const DEFAULT_TEAM_NOTICE = "Gunakan kode team yang sama untuk gabung grup yang sama.";
const MEMBER_LOGIN_STORAGE_KEY = "liveteams.memberLogin.v1";
const ADMIN_PORTAL_SESSION_KEY = "liveteams.adminPortalLogin.v1";
const DM_HISTORY_CLEAR_CUTOFF_STORAGE_KEY = "liveteams.dmHistoryClearCutoff.v1";
const DM_HIDDEN_ROUTES_STORAGE_KEY = "liveteams.dmHiddenRoutes.v1";
const TENOR_API_KEY = "LIVDSRZULELA";
const TENOR_CLIENT_KEY = "liveteams-livechat";
const MOBILE_SIDEBAR_BREAKPOINT = 900;
const AUTO_CROWD_USER_COUNT = 108;
const AUTO_CROWD_ACTIVE_CHATTERS = 24;
const AUTO_CROWD_ROTATE_INTERVAL_MS = 60 * 60 * 1000;
const SIMULATION_PRESENCE_RESET_INTERVAL_MS = 60 * 60 * 1000;
const AUTO_CROWD_ONLINE_MIN = 22;
const AUTO_CROWD_ONLINE_MAX = 52;
const SIMULATION_MEMBER_TARGET_TOTAL = 48;
const SIMULATION_GUEST_TARGET_TOTAL = 30;
const ADMIN_STATS_HISTORY_LIMIT = 28;
const ADMIN_STATS_MIN_SAMPLE_GAP_MS = 2500;
const AUTO_CROWD_REAL_MEMBER_PAUSE_THRESHOLD = 999;
const AUTO_CROWD_THREAD_MESSAGE_GAP_MS = 7600;
const AUTO_CROWD_TYPING_LEAD_MS = 1800;
const AUTO_CROWD_WAVE_BASE_DELAY_MS = 2600;
const AUTO_CROWD_WAVE_GAP_MS = 5200;
const AUTO_CROWD_WAVE_RANDOM_DELAY_MS = 1800;
const AUTO_CROWD_DISCUSSION_START_DELAY_MS = 3200;
const AUTO_CROWD_DISCUSSION_RETRY_MS = 1400;
const AUTO_CROWD_DISCUSSION_RETRY_MAX_ATTEMPTS = 12;
const currentPathname = window.location.pathname.toLowerCase();
const isAdminPortal = currentPathname.startsWith("/admin");
const isAdminSettingsPortal = currentPathname.startsWith("/admin/settings");
const isMemberLoginPortal = window.location.pathname.toLowerCase().startsWith("/login");
const isRegistrationPortal = window.location.pathname.toLowerCase().startsWith("/daftar");
const pageQuery = new URLSearchParams(window.location.search);
const PUBLIC_JOIN_ROLE_OPTIONS = [
  { value: "guest", label: "Guest" },
  { value: "member", label: "Member" }
];
const ADMIN_JOIN_ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "operator", label: "Operator" },
  { value: "owner", label: "Owner" }
];

try {
  history.scrollRestoration = "manual";
} catch {
  // Ignore browsers that do not support scroll restoration control.
}

const resetSidebarScrollPosition = () => {
  if (sidebarPanel) {
    sidebarPanel.scrollTop = 0;
  }
};

const resetSidebarScrollPositionLater = () => {
  resetSidebarScrollPosition();
  requestAnimationFrame(() => {
    resetSidebarScrollPosition();
    requestAnimationFrame(resetSidebarScrollPosition);
  });
};

const keepSidebarAtTopBriefly = () => {
  resetSidebarScrollPositionLater();
  const timerId = window.setInterval(resetSidebarScrollPosition, 50);
  window.setTimeout(() => {
    window.clearInterval(timerId);
  }, 800);
};

let currentUser = "";
let currentTeam = DEFAULT_TEAM;
let currentChannel = DEFAULT_CHANNEL;
let currentTeamNotice = DEFAULT_TEAM_NOTICE;
let currentRole = "member";
let currentUserIsRegisteredMember = false;
let currentPinnedMessage = null;
let currentAccessPassword = "";
let connectionOnline = false;
let typingTimer = null;
let isTyping = false;
let currentView = {
  type: "channel",
  channelCode: DEFAULT_CHANNEL,
  dmKey: "",
  peerName: "",
  supportScope: ""
};
let dmConversations = [];
const dmConversationMeta = new Map();
let currentDmListFilter = "all";
let demoBots = [];
let demoModeEnabled = false;
let autoCrowdChannelCode = "";
let autoCrowdRotateTimerId = null;
let autoCrowdPausedByRealMembers = false;
let hasJoinedServer = false;
let codeModeLanguage = "off";
let activeEditMessageId = "";
const messageCache = new Map();
let currentTeamMembers = [];
let currentTeamChannels = [DEFAULT_CHANNEL];
let selectedJoinTeamCodes = new Set();
let selectedJoinChannelCodes = new Set();
let pendingChannelSwitchCode = "";
let broadcastTargetTeams = [DEFAULT_TEAM];
const broadcastChannelsByTeam = new Map([[DEFAULT_TEAM, [DEFAULT_CHANNEL]]]);
const broadcastActiveChannelsByTeam = new Map([[DEFAULT_TEAM, [DEFAULT_CHANNEL]]]);
const knownChannelsByTeam = new Map([[DEFAULT_TEAM, [DEFAULT_CHANNEL]]]);
let selectedBroadcastTeamCodes = new Set();
let selectedBroadcastChannelCodes = new Set();
let selectedBroadcastRecipientRoles = new Set();
let selectedBulkDeleteTargets = new Set(["livechat", "directmessages"]);
let broadcastNoticeTimerId = null;
let broadcastSendPendingTimerId = null;
let broadcastSendInFlight = false;
let pendingAutoOpenBroadcastDm = null;
const suppressedEmptyDmKeys = new Set();
const pendingDetachedDmMessages = new Map();
const pendingDetachedDmMessagesByPeer = new Map();
const dmHistoryClearCutoffByKey = new Map();
let dmHistoryClearCutoffProfileKey = "";
const hiddenDmRoutesByKey = new Set();
let hiddenDmRoutesProfileKey = "";
let currentPresenceUsers = [];
let globalPresenceUsers = [];
let knownTeamCodes = [DEFAULT_TEAM];
let pendingTeamSwitchCode = "";
let pendingTeamSwitchView = null;
let pendingPortalJoinAttempt = false;
let pendingDirectAdminAutoStartOnJoin = false;
let currentAuthState = {
  hasOwner: false,
  ownerName: "",
  adminNames: [],
  operatorNames: []
};
let currentLoginConfig = {
  showTeamSelect: true,
  showChannelSelect: true,
  teamOptions: [DEFAULT_TEAM],
  channelOptions: [DEFAULT_CHANNEL]
};
let currentSimulationConfig = {
  enabled: false
};
let currentUploadConfig = {
  imageLimitMb: 8,
  videoLimitMb: 20,
  audioLimitMb: 12,
  fileLimitMb: 10
};
let currentDirectAdminConfig = {
  enabled: true
};
let currentGlobalStats = {
  onlineUsers: 0,
  memberOnline: 0,
  guestOnline: 0,
  totalVisitors: 0,
  updatedAt: "",
  source: "sinkronisasi server"
};
let hasReceivedGlobalStatsFromServer = false;
let lastAdminStatsSampleAt = 0;
const adminStatsHistory = [];
let pendingSettingsPassword = "";
let lastGifQuery = "";
let sidebarTouchStartX = 0;
let sidebarTouchStartY = 0;
let sidebarTouchLastX = 0;
let sidebarTouchLastY = 0;
let sidebarSwipeTracking = false;
let statusNoticeTimerId = null;
let keyboardAdjustmentTimerId = null;
let messageListUserInteracting = false;
let hasRequestedBrowserNotificationPermission = false;
const incomingMessageNoticeIds = [];
const MAX_INCOMING_NOTICE_IDS = 180;
const simulationPresenceState = {
  member: {
    lastResetAt: 0,
    onlineById: new Map()
  },
  privileged: {
    lastResetAt: 0,
    onlineById: new Map()
  },
  guest: {
    lastResetAt: 0,
    onlineById: new Map()
  }
};
const audienceOrderState = {
  member: {
    nextRank: 0,
    entryByKey: new Map(),
    rankByKey: new Map()
  },
  privileged: {
    nextRank: 0,
    entryByKey: new Map(),
    rankByKey: new Map()
  },
  guest: {
    nextRank: 0,
    entryByKey: new Map(),
    rankByKey: new Map()
  }
};

const QUICK_EMOJIS = [
  "😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "🙂", "🙃", "😎", "🤩", "🥳", "🤗",
  "😇", "😍", "😘", "😋", "😜", "🤪", "🤔", "🫡", "🤭", "🤫", "😴", "😌", "😮", "😢", "😭", "😡",
  "🤯", "🥶", "🥵", "😱", "😬", "🙄", "🤐", "😷", "🤒", "🤕", "🤠", "👻", "🤖", "💀", "👀", "🫶",
  "👍", "👎", "👏", "🙌", "🙏", "🤝", "✌️", "👌", "🤟", "👊", "💪", "🫡", "❤️", "🧡", "💛", "💚",
  "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💯", "✨", "🔥", "⭐", "🌟", "⚡", "🎉",
  "🎊", "🎈", "🥇", "🏆", "✅", "❌", "⚠️", "💡", "📌", "🚀", "💻", "📱", "🎵", "🎬", "🍕", "☕"
];
const AUTO_CROWD_FIRST_NAMES = [
  "Alya", "Siti", "Nadia", "Putri", "Rania", "Safira", "Ayu", "Nisa", "Devi", "Rizka",
  "Dinda", "Tiara", "Salma", "Mutiara", "Salsa", "Intan", "Cinta", "Nabila", "Aisyah", "Laila",
  "Rizky", "Arif", "Dimas", "Fajar", "Rafi", "Bagas", "Rizal", "Deni", "Alif", "Nanda",
  "Farhan", "Bayu", "Iqbal", "Reza", "Hendra", "Yuda", "Adit", "Yoga", "Rangga", "Fauzi"
];
const AUTO_CROWD_LAST_NAMES = [
  "Putri", "Azzahra", "Permata", "Lestari", "Salsabila", "Kusuma", "Pratama", "Saputra", "Ramadhan", "Maulana",
  "Wicaksono", "Nugroho", "Hidayat", "Firmansyah", "Pangestu", "Santoso", "Pranata", "Wijaya", "Setiawan", "Syahputra",
  "Utama", "Purnama", "Prakoso", "Mulyadi", "Kurniawan", "Bakti", "Wijanarko", "Pamungkas", "Siregar", "Harahap"
];
const AUTO_CROWD_THREAD_STARTERS = [
  "Pagi {name}, update terakhir di channel ini gimana?",
  "{name}, tadi aku lihat panelnya sudah jauh lebih rapi.",
  "Ada yang sudah coba join ulang setelah logout, {name}?",
  "{name}, star kecil di member simulasi itu sekarang sudah enak kelihatannya.",
  "Menurut {name}, malam ini masih perlu polish kecil lagi atau sudah cukup?",
  "{name}, tampilan member list sekarang lebih lega ya?",
  "Kalau buat alur chat, {name} rasa sudah natural belum?",
  "{name}, dropdown role yang compact itu menurutmu sudah pas?"
];
const AUTO_CROWD_THREAD_RESPONSES = [
  "Iya, aku lagi cek bagian UI biar tetap rapi di mobile.",
  "Sudah, dan sekarang notifikasi left nggak muncul lagi pas refresh.",
  "Bagus, jadi chat history-nya juga lebih bersih dibaca.",
  "Setuju, panelnya jadi nggak terasa sempit lagi.",
  "Kalau menurutku flow-nya sekarang terasa lebih halus.",
  "Mantap, jadi admin langsung kelihatan siapa yang real dan siapa yang simulasi.",
  "Aku suka, karena nama-nama sekarang lebih kebaca.",
  "Sip, nanti aku pantau lagi setelah jam makan siang.",
  "Dropdown role juga lebih compact, jadi card-nya tidak panjang ke bawah.",
  "Tampilan ini sudah enak buat dipakai harian.",
  "Kalau backend-nya stabil, kita bisa lanjut rapihin minor bug.",
  "Aku rasa cukup, tinggal sedikit sentuhan saja.",
  "Itu bikin room terasa lebih hidup dan natural.",
  "Ya, sekarang lebih mirip obrolan beneran daripada demo text.",
  "Bagus, berarti perubahan terakhirnya memang kena di pengalaman pakai."
];
const AUTO_CROWD_THREAD_FOLLOWUPS = [
  "Bener, jadi room-nya terasa lebih hidup.",
  "Iya, jadi lebih nyaman dilihat di layar kecil.",
  "Setuju, alurnya sekarang nggak berasa dipaksa.",
  "Mantap, berarti tinggal dipakai saja.",
  "Aku juga lihat hasilnya lebih bersih.",
  "Pas, ini sudah jauh lebih natural.",
  "Betul, pembaca jadi nggak cepat bosan.",
  "Oke, kalau begitu kita lanjut pantau saja.",
  "Sip, jadi makin mirip percakapan asli.",
  "Ya, itu yang bikin tampilannya terasa ramai.",
  "Bagus, jadi semua bagian tetap seimbang.",
  "Setuju, nggak ada yang terlalu menonjol sendiri."
];
const AUTO_CROWD_THREAD_ENDINGS = [
  "Nanti kalau ada yang perlu, tinggal lanjut bahas di sini.",
  "Kalau ada update baru, kita sambung lagi setelahnya.",
  "Sip, aku standby di channel ini dulu.",
  "Oke, lanjutkan saja kalau ada detail tambahan.",
  "Siap, kita keep obrolannya tetap santai.",
  "Nanti kalau ada perubahan, langsung kelihatan di room ini.",
  "Aku tunggu update berikutnya ya.",
  "Setuju, yang penting obrolannya tetap ringan dan jelas."
];

const pageQuery = new URLSearchParams(window.location.search);
const isEmbedMode = pageQuery.has("embed");
const isLiveChatEmbed = pageQuery.has("livechat");
if (isEmbedMode) {
  document.body.classList.add("embed-mode");
}

const getLiveChatDefaultName = () => {
  const rawName = String(pageQuery.get("name") || "").trim();
  if (rawName) {
    return normalizeDisplayName(rawName.slice(0, 24));
  }

  const timestamp = Date.now().toString().slice(-4);
  return `Guest-${timestamp}`;
};

const liveChatAutoJoin = async () => {
  if (!isLiveChatEmbed) {
    return;
  }

  const liveName = getLiveChatDefaultName();
  const liveTeam = normalizeCode(pageQuery.get("team"), DEFAULT_TEAM);
  const liveChannel = normalizeCode(pageQuery.get("channel"), DEFAULT_CHANNEL);
  const liveRole = "guest";

  currentUser = liveName;
  currentTeam = liveTeam;
  currentChannel = liveChannel;
  currentRole = liveRole;
  currentAccessPassword = "";
  currentView = {
    type: "channel",
    channelCode: currentChannel,
    dmKey: "",
    peerName: "",
    supportScope: ""
  };

  setHeader();
  renderDmList();
  pendingPortalJoinAttempt = true;
  emitJoinRequest();
  setChatReadyState(false);
};

const CURATED_GIFS = [
  { title: "Happy Cat", tags: ["happy", "cat", "cute"], url: "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" },
  { title: "Excited", tags: ["happy", "excited", "yay"], url: "https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif" },
  { title: "Thumbs Up", tags: ["ok", "good", "thumbs"], url: "https://media.giphy.com/media/111ebonMs90YLu/giphy.gif" },
  { title: "Laughing", tags: ["laugh", "funny", "lol"], url: "https://media.giphy.com/media/10JhviFuU2gWD6/giphy.gif" },
  { title: "Mind Blown", tags: ["wow", "mind blown", "surprised"], url: "https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif" },
  { title: "Clap", tags: ["clap", "applause", "nice"], url: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif" },
  { title: "Love", tags: ["love", "heart", "sweet"], url: "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif" },
  { title: "Thanks", tags: ["thanks", "thank you", "appreciate"], url: "https://media.giphy.com/media/26gsjCZpPolPr3sBy/giphy.gif" },
  { title: "Facepalm", tags: ["facepalm", "fail", "oops"], url: "https://media.giphy.com/media/3o7TKqm1mNujcBPSpy/giphy.gif" },
  { title: "No Way", tags: ["no", "shock", "no way"], url: "https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif" },
  { title: "Nod Yes", tags: ["yes", "agree", "nod"], url: "https://media.giphy.com/media/3o6ZtpxSZbQRRnwCKQ/giphy.gif" },
  { title: "Coffee", tags: ["coffee", "morning", "work"], url: "https://media.giphy.com/media/3oriO04qxVReM5rJEA/giphy.gif" },
  { title: "Typing", tags: ["typing", "work", "busy"], url: "https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif" },
  { title: "Coding", tags: ["code", "coding", "developer"], url: "https://media.giphy.com/media/ZVik7pBtu9dNS/giphy.gif" },
  { title: "High Five", tags: ["high five", "team", "great"], url: "https://media.giphy.com/media/xT9DPIlGnuHpr2yObu/giphy.gif" },
  { title: "Celebrate", tags: ["win", "celebrate", "success"], url: "https://media.giphy.com/media/26tOZ42Mg6pbTUPHW/giphy.gif" },
  { title: "Sad", tags: ["sad", "cry", "oops"], url: "https://media.giphy.com/media/ROF8OQvDmxytW/giphy.gif" },
  { title: "Sleepy", tags: ["sleep", "tired", "night"], url: "https://media.giphy.com/media/l2JhpjWPccQhsAMfu/giphy.gif" }
];

const ROLE_LABELS = {
  guest: "Guest",
  member: "Member",
  operator: "Operator",
  admin: "Admin",
  owner: "Owner",
  ai: "AI Helper",
  system: "System"
};

const isPrivilegedRole = (role) => role === "owner" || role === "admin" || role === "operator";
const canManageRoles = (role) => role === "owner" || role === "admin";
const canUseDemoUsers = (role) => role === "owner" || role === "admin" || role === "member" || role === "guest";
const canPinMessages = (role) => role === "owner" || role === "admin";
const canCreateChannels = (role) => role === "owner" || role === "admin" || role === "operator";

const isLiveChatSupportConversation = (conversation, meta) => {
  const scope = String(conversation?.supportScope || meta?.supportScope || "").trim().toLowerCase();
  const dmKey = String(conversation?.dmKey || "").trim().toUpperCase();
  return scope === "admins" || dmKey.startsWith("ADMINSUPPORT::");
};

const normalizeRole = (value) => {
  const role = String(value || "").trim().toLowerCase();
  if (role === "guest") {
    return "guest";
  }

  if (role === "owner") {
    return "owner";
  }

  if (role === "admin") {
    return "admin";
  }

  if (role === "operator") {
    return "operator";
  }

  if (role === "ai") {
    return "ai";
  }

  if (role === "system") {
    return "system";
  }

  return "member";
};

const getRoleLabel = (role) => ROLE_LABELS[normalizeRole(role)] || ROLE_LABELS.member;

const getJoinRoleUiLabel = (roleValue) => {
  const role = String(roleValue || "").trim().toLowerCase();
  if (role === "guest") {
    return "Guest";
  }

  if (role === "owner") {
    return "Owner";
  }

  if (role === "operator") {
    return "Operator";
  }

  if (role === "admin") {
    return "Admin";
  }

  return "Member";
};

const getDefaultJoinRoleValue = () => (isAdminPortal ? "admin" : "guest");

const getJoinRoleOptions = () => (isAdminPortal ? ADMIN_JOIN_ROLE_OPTIONS : PUBLIC_JOIN_ROLE_OPTIONS);

const applyJoinRoleOptions = () => {
  if (!joinRoleSelect || !joinRoleMenu) {
    return;
  }

  const options = getJoinRoleOptions();
  joinRoleMenu.replaceChildren();
  joinRoleSelect.replaceChildren();

  options.forEach((option, index) => {
    const optionButton = document.createElement("button");
    optionButton.type = "button";
    optionButton.className = "join-role-option";
    optionButton.setAttribute("data-join-role", option.value);
    optionButton.setAttribute("role", "option");
    optionButton.setAttribute("aria-selected", index === 0 ? "true" : "false");
    optionButton.textContent = option.label;
    if (index === 0) {
      optionButton.classList.add("active");
    }
    joinRoleMenu.appendChild(optionButton);

    const nativeOption = document.createElement("option");
    nativeOption.value = option.value;
    nativeOption.textContent = option.label;
    if (index === 0) {
      nativeOption.selected = true;
    }
    joinRoleSelect.appendChild(nativeOption);
  });

  joinRoleSelect.value = getDefaultJoinRoleValue();
};

const FEMALE_NAME_HINTS = new Set([
  "citra", "gina", "intan", "salsa", "vina", "fina", "rani", "sari", "ayu", "dewi", "putri", "nisa", "nisaa", "amel", "amelia", "linda", "nurul", "ana", "ani", "tia"
]);

const MALE_NAME_HINTS = new Set([
  "andi", "budi", "dimas", "eka", "fajar", "hadi", "joko", "rafi", "joko", "jaka", "yoga", "rizky", "arif", "agus", "fauzi", "rio", "indra", "tono", "bayu", "adit"
]);

const normalizeCode = (value, fallback) => {
  const raw = String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "")
    .slice(0, 20)
    .trim();

  return raw || fallback;
};

const normalizeTeamNotice = (value, fallback = DEFAULT_TEAM_NOTICE) => {
  const clean = String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);

  return clean || fallback;
};

const normalizeLoginCodeOptions = (value, fallback) => {
  const source = Array.isArray(value)
    ? value
    : String(value || "").split(",");

  const cleaned = source
    .map((entry) => normalizeCode(entry, ""))
    .filter(Boolean);

  const unique = Array.from(new Set(cleaned));
  if (!unique.length) {
    return [fallback];
  }

  return unique;
};

const normalizeLoginConfig = (rawConfig) => {
  const config = rawConfig && typeof rawConfig === "object" ? rawConfig : {};
  return {
    showTeamSelect: config.showTeamSelect !== false,
    showChannelSelect: config.showChannelSelect !== false,
    teamOptions: normalizeLoginCodeOptions(config.teamOptions, DEFAULT_TEAM),
    channelOptions: normalizeLoginCodeOptions(config.channelOptions, DEFAULT_CHANNEL)
  };
};

const normalizeSimulationConfig = (rawConfig) => {
  void rawConfig;
  return { enabled: false };
};

const normalizeUploadConfig = (rawConfig) => {
  const config = rawConfig && typeof rawConfig === "object" ? rawConfig : {};
  const clamp = (value, fallback) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return fallback;
    }

    return Math.min(250, Math.max(1, Math.round(numeric)));
  };

  return {
    imageLimitMb: clamp(config.imageLimitMb, 8),
    videoLimitMb: clamp(config.videoLimitMb, 20),
    audioLimitMb: clamp(config.audioLimitMb, 12),
    fileLimitMb: clamp(config.fileLimitMb, 10)
  };
};

const directAdminUiSupportFactory = window.DirectAdminSupport?.createDirectAdminUiSupport;
const directAdminUiSupport = typeof directAdminUiSupportFactory === "function"
  ? directAdminUiSupportFactory({
    normalizeRole,
    isAdminPortal,
    elements: {
      directAdminEnabledToggle,
      directAdminDmButton,
      directAdminDmHint,
      joinDirectAdminField,
      joinDirectAdminInput,
      joinRoleSelect
    },
    getState: () => ({
      currentDirectAdminConfig,
      currentRole,
      currentUser,
      hasJoinedServer
    }),
    setState: (nextState) => {
      if (nextState && Object.prototype.hasOwnProperty.call(nextState, "currentDirectAdminConfig")) {
        currentDirectAdminConfig = nextState.currentDirectAdminConfig;
      }
    }
  })
  : null;

const normalizeDirectAdminConfig = (rawConfig) => {
  if (directAdminUiSupport) {
    return directAdminUiSupport.normalizeConfig(rawConfig);
  }

  const config = rawConfig && typeof rawConfig === "object" ? rawConfig : {};
  return {
    enabled: config.enabled !== false
  };
};

const optionsToCsv = (options) => options.join(", ");

const setLoginToggleButtonState = (button, enabled) => {
  if (!button) {
    return;
  }

  const isEnabled = Boolean(enabled);
  button.textContent = isEnabled ? "ON" : "OFF";
  button.setAttribute("aria-pressed", isEnabled ? "true" : "false");
  button.classList.toggle("is-on", isEnabled);
};

const setDirectAdminToggleButtonState = (button, enabled) => {
  if (directAdminUiSupport) {
    directAdminUiSupport.setToggleButtonState(button, enabled);
    return;
  }

  if (!button) {
    return;
  }

  const isEnabled = Boolean(enabled);
  button.textContent = isEnabled ? "ON" : "OFF";
  button.setAttribute("aria-pressed", isEnabled ? "true" : "false");
  button.classList.toggle("is-on", isEnabled);
};

const syncLoginConfigAdminForm = (configInput = currentLoginConfig) => {
  const config = normalizeLoginConfig(configInput);
  setLoginToggleButtonState(loginShowTeamToggle, config.showTeamSelect);
  setLoginToggleButtonState(loginShowChannelToggle, config.showChannelSelect);
  if (loginShowTeamToggle) {
    loginShowTeamToggle.dataset.enabled = config.showTeamSelect ? "true" : "false";
  }
  if (loginShowChannelToggle) {
    loginShowChannelToggle.dataset.enabled = config.showChannelSelect ? "true" : "false";
  }
  if (loginTeamOptionsInput) {
    loginTeamOptionsInput.value = optionsToCsv(config.teamOptions);
  }
  if (loginChannelOptionsInput) {
    loginChannelOptionsInput.value = optionsToCsv(config.channelOptions);
  }
};

const syncSimulationConfigAdminForm = (configInput = currentSimulationConfig) => {
  void configInput;
};

const syncUploadConfigAdminForm = (configInput = currentUploadConfig) => {
  const config = normalizeUploadConfig(configInput);
  if (uploadImageLimitInput) {
    uploadImageLimitInput.value = String(config.imageLimitMb);
  }
  if (uploadVideoLimitInput) {
    uploadVideoLimitInput.value = String(config.videoLimitMb);
  }
  if (uploadAudioLimitInput) {
    uploadAudioLimitInput.value = String(config.audioLimitMb);
  }
  if (uploadFileLimitInput) {
    uploadFileLimitInput.value = String(config.fileLimitMb);
  }
};

const syncDirectAdminConfigAdminForm = (configInput = currentDirectAdminConfig) => {
  if (directAdminUiSupport) {
    directAdminUiSupport.syncAdminForm(configInput);
    return;
  }

  const config = normalizeDirectAdminConfig(configInput);
  setDirectAdminToggleButtonState(directAdminEnabledToggle, config.enabled);
  if (directAdminEnabledToggle) {
    directAdminEnabledToggle.dataset.enabled = config.enabled ? "true" : "false";
  }
};

const applySimulationConfig = (configInput) => {
  void configInput;
  currentSimulationConfig = { enabled: false };
  syncSimulationConfigAdminForm(currentSimulationConfig);

  renderUsers(currentPresenceUsers);
};

const applyUploadConfig = (configInput) => {
  currentUploadConfig = normalizeUploadConfig(configInput || currentUploadConfig);
  syncUploadConfigAdminForm(currentUploadConfig);
};

const updateDirectAdminActionVisibility = () => {
  if (directAdminUiSupport) {
    directAdminUiSupport.updateActionVisibility();
    return;
  }

  const normalizedRole = normalizeRole(currentRole);
  const canUseDirectAdmin = !isAdminPortal
    && currentDirectAdminConfig.enabled
    && (normalizedRole === "guest" || normalizedRole === "member")
    && Boolean(currentUser);

  if (directAdminDmButton) {
    directAdminDmButton.classList.toggle("hidden", !canUseDirectAdmin);
    directAdminDmButton.disabled = !canUseDirectAdmin || !hasJoinedServer;
  }

  if (directAdminDmHint) {
    directAdminDmHint.classList.toggle("hidden", !canUseDirectAdmin);
  }
};

const applyDirectAdminConfig = (configInput) => {
  if (directAdminUiSupport) {
    directAdminUiSupport.applyConfig(configInput);
    return;
  }

  currentDirectAdminConfig = normalizeDirectAdminConfig(configInput || currentDirectAdminConfig);
  syncDirectAdminConfigAdminForm(currentDirectAdminConfig);
  updateDirectAdminActionVisibility();

  const selectedRole = normalizeRole(joinRoleSelect?.value || "guest");
  const canShowJoinOption = !isAdminPortal
    && currentDirectAdminConfig.enabled
    && (selectedRole === "guest" || selectedRole === "member");

  if (joinDirectAdminField) {
    joinDirectAdminField.classList.toggle("hidden", !canShowJoinOption);
  }

  if (joinDirectAdminInput) {
    joinDirectAdminInput.value = "admins";
  }
};

const populateLoginSelectOptions = (selectElement, options, fallback) => {
  if (!selectElement) {
    return;
  }

  const normalizedOptions = normalizeLoginCodeOptions(options, fallback);
  const previousValue = normalizeCode(selectElement.value, fallback);
  selectElement.replaceChildren();

  normalizedOptions.forEach((code) => {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = code;
    selectElement.appendChild(option);
  });

  selectElement.value = normalizedOptions.includes(previousValue)
    ? previousValue
    : normalizedOptions[0];
};

const createJoinChecklistItem = ({ label, checked, onToggle }) => {
  const item = document.createElement("label");
  item.className = "broadcast-checklist-item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = Boolean(checked);
  checkbox.addEventListener("change", () => {
    onToggle(Boolean(checkbox.checked));
  });

  const text = document.createElement("span");
  text.textContent = label;

  item.appendChild(checkbox);
  item.appendChild(text);
  return item;
};

const syncJoinSelectMirrors = () => {
  const selectedTeams = Array.from(selectedJoinTeamCodes)
    .map((teamCode) => normalizeCode(teamCode, ""))
    .filter(Boolean);
  const selectedChannels = Array.from(selectedJoinChannelCodes)
    .map((channelCode) => normalizeCode(channelCode, ""))
    .filter(Boolean);

  if (teamInput) {
    teamInput.value = selectedTeams[0] || "";
    teamInput.dispatchEvent(new Event("change"));
  }

  if (joinChannelInput) {
    joinChannelInput.value = selectedChannels[0] || "";
    joinChannelInput.dispatchEvent(new Event("change"));
  }
};

const updateJoinChecklistTriggerLabels = () => {
  if (joinTeamChecklistTrigger) {
    const total = selectedJoinTeamCodes.size;
    joinTeamChecklistTrigger.textContent = total > 0
      ? `Team dipilih (${total})`
      : "Pilih Team (Checklist)";
  }

  if (joinChannelChecklistTrigger) {
    const total = selectedJoinChannelCodes.size;
    joinChannelChecklistTrigger.textContent = total > 0
      ? `Channels dipilih (${total})`
      : "Pilih Channels (Checklist)";
  }
};

const renderJoinChecklists = (configInput = currentLoginConfig, preferDefaults = false) => {
  const config = normalizeLoginConfig(configInput || currentLoginConfig);
  const normalizedTeams = Array.from(
    new Set(
      (Array.isArray(config.teamOptions) ? config.teamOptions : [DEFAULT_TEAM])
        .map((teamCode) => normalizeCode(teamCode, ""))
        .filter(Boolean)
    )
  );
  const normalizedChannels = Array.from(
    new Set(
      (Array.isArray(config.channelOptions) ? config.channelOptions : [DEFAULT_CHANNEL])
        .map((channelCode) => normalizeCode(channelCode, ""))
        .filter(Boolean)
    )
  );

  if (preferDefaults && selectedJoinTeamCodes.size === 0 && normalizedTeams.length > 0) {
    selectedJoinTeamCodes = new Set([normalizedTeams[0]]);
  }
  if (preferDefaults && selectedJoinChannelCodes.size === 0 && normalizedChannels.length > 0) {
    selectedJoinChannelCodes = new Set([normalizedChannels[0]]);
  }

  selectedJoinTeamCodes = new Set(
    Array.from(selectedJoinTeamCodes).filter((teamCode) => normalizedTeams.includes(teamCode))
  );
  selectedJoinChannelCodes = new Set(
    Array.from(selectedJoinChannelCodes).filter((channelCode) => normalizedChannels.includes(channelCode))
  );

  if (joinTeamChecklistMenu) {
    joinTeamChecklistMenu.replaceChildren();
    normalizedTeams.forEach((teamCode) => {
      const item = createJoinChecklistItem({
        label: teamCode,
        checked: selectedJoinTeamCodes.has(teamCode),
        onToggle: (checked) => {
          if (checked) {
            selectedJoinTeamCodes.add(teamCode);
          } else {
            selectedJoinTeamCodes.delete(teamCode);
          }
          renderJoinChecklists(currentLoginConfig, false);
        }
      });
      joinTeamChecklistMenu.appendChild(item);
    });
  }

  if (joinChannelChecklistMenu) {
    joinChannelChecklistMenu.replaceChildren();
    normalizedChannels.forEach((channelCode) => {
      const item = createJoinChecklistItem({
        label: `#${channelCode}`,
        checked: selectedJoinChannelCodes.has(channelCode),
        onToggle: (checked) => {
          if (checked) {
            selectedJoinChannelCodes.add(channelCode);
          } else {
            selectedJoinChannelCodes.delete(channelCode);
          }
          renderJoinChecklists(currentLoginConfig, false);
        }
      });
      joinChannelChecklistMenu.appendChild(item);
    });
  }

  syncJoinSelectMirrors();
  updateJoinChecklistTriggerLabels();
};

const setKnownTeamCodes = (teamCodes = []) => {
  const normalized = Array.from(
    new Set(
      (Array.isArray(teamCodes) ? teamCodes : [teamCodes])
        .map((teamCode) => normalizeCode(teamCode, ""))
        .filter(Boolean)
    )
  );

  if (!normalized.includes(DEFAULT_TEAM)) {
    normalized.unshift(DEFAULT_TEAM);
  }
  if (currentTeam && !normalized.includes(currentTeam)) {
    normalized.unshift(currentTeam);
  }

  knownTeamCodes = normalized;
};

const setKnownTeamChannels = (teamCode, channels = []) => {
  const safeTeamCode = normalizeCode(teamCode, "");
  if (!safeTeamCode) {
    return;
  }

  const normalizedChannels = Array.from(
    new Set(
      (Array.isArray(channels) ? channels : [channels])
        .map((channelCode) => normalizeCode(channelCode, ""))
        .filter(Boolean)
    )
  );

  if (!normalizedChannels.includes(DEFAULT_CHANNEL)) {
    normalizedChannels.unshift(DEFAULT_CHANNEL);
  }

  knownChannelsByTeam.set(safeTeamCode, normalizedChannels);
};

const getPreferredChannelForTeam = (teamCode) => {
  const safeTeamCode = normalizeCode(teamCode, DEFAULT_TEAM);
  const channels = knownChannelsByTeam.get(safeTeamCode) || [DEFAULT_CHANNEL];
  const normalizedChannels = Array.isArray(channels) && channels.length > 0 ? channels : [DEFAULT_CHANNEL];
  return normalizedChannels.includes(currentChannel) ? currentChannel : normalizedChannels[0];
};

const requestTeamSwitch = (teamCode) => {
  const nextTeamCode = normalizeCode(teamCode, "");
  if (!nextTeamCode || !currentUser) {
    return;
  }

  if (!hasJoinedServer) {
    notify("Join team dulu sebelum pindah team.", "warning", { inlineDuration: 2600 });
    return;
  }

  if (pendingTeamSwitchCode) {
    return;
  }

  if (nextTeamCode === currentTeam && currentView.type === "channel") {
    closeMobileSidebar();
    return;
  }

  pendingTeamSwitchCode = nextTeamCode;
  pendingTeamSwitchView = {
    type: currentView.type,
    channelCode: currentView.channelCode,
    dmKey: currentView.dmKey,
    peerName: currentView.peerName,
    supportScope: currentView.supportScope
  };
  currentView = {
    type: "channel",
    channelCode: getPreferredChannelForTeam(nextTeamCode),
    dmKey: "",
    peerName: "",
    supportScope: ""
  };
  renderTeams();
  setChatReadyState(false);
  closeMobileSidebar();
  notify(`Pindah ke team ${nextTeamCode}...`, "info", { inlineDuration: 1800, toast: false });

  socket.emit("join:request", {
    name: currentUser,
    teamCode: nextTeamCode,
    channelCode: currentView.channelCode,
    role: currentRole,
    password: currentAccessPassword
  });
};

const requestChannelSwitch = (channelCode) => {
  const nextChannelCode = normalizeCode(channelCode, "");
  if (!nextChannelCode) {
    return;
  }

  if (!hasJoinedServer) {
    notify("Join team dulu sebelum pindah channel.", "warning", { inlineDuration: 2600 });
    return;
  }

  if (pendingChannelSwitchCode || pendingTeamSwitchCode) {
    return;
  }

  if (nextChannelCode === currentChannel && currentView.type === "channel") {
    return;
  }

  pendingChannelSwitchCode = nextChannelCode;
  renderChannels(currentTeamChannels);
  setChatReadyState(false);
  notify(`Pindah ke channel #${nextChannelCode}...`, "info", { inlineDuration: 1600, toast: false });
  socket.emit("channel:switch", { channelCode: nextChannelCode });
};

const renderTeams = () => {
  if (!teamList) {
    return;
  }

  if (!currentTeam && currentView.type === "dm") {
    teamList.replaceChildren();
    const item = document.createElement("li");
    item.className = "channel-empty-state";
    item.textContent = "Mode privat tanpa team.";
    teamList.appendChild(item);
    return;
  }

  const teamCodes = Array.from(
    new Set(
      (Array.isArray(knownTeamCodes) ? knownTeamCodes : [DEFAULT_TEAM])
        .map((teamCode) => normalizeCode(teamCode, ""))
        .filter(Boolean)
    )
  );

  if (!teamCodes.includes(DEFAULT_TEAM)) {
    teamCodes.unshift(DEFAULT_TEAM);
  }
  if (currentTeam && !teamCodes.includes(currentTeam)) {
    teamCodes.unshift(currentTeam);
  }

  teamList.replaceChildren();

  teamCodes.forEach((teamCode) => {
    const item = document.createElement("li");
    const label = document.createElement("button");
    label.type = "button";
    label.className = "channel-item team-item";
    label.textContent = pendingTeamSwitchCode === teamCode ? `${teamCode} - pindah...` : teamCode;
    label.classList.toggle("active", teamCode === currentTeam);
    label.classList.toggle("pending", pendingTeamSwitchCode === teamCode);
    label.disabled = Boolean(pendingTeamSwitchCode);
    label.setAttribute("aria-busy", pendingTeamSwitchCode === teamCode ? "true" : "false");
    label.addEventListener("click", () => {
      requestTeamSwitch(teamCode);
    });
    item.appendChild(label);
    teamList.appendChild(item);
  });
};

const applyLoginConfigToJoinForm = (configInput) => {
  currentLoginConfig = normalizeLoginConfig(configInput || currentLoginConfig);

  const fallbackChannels = Array.from(
    new Set(
      (Array.isArray(currentLoginConfig.channelOptions) ? currentLoginConfig.channelOptions : [DEFAULT_CHANNEL])
        .map((channelCode) => normalizeCode(channelCode, ""))
        .filter(Boolean)
    )
  );

  (Array.isArray(currentLoginConfig.teamOptions) ? currentLoginConfig.teamOptions : [DEFAULT_TEAM])
    .map((teamCode) => normalizeCode(teamCode, ""))
    .filter(Boolean)
    .forEach((teamCode) => {
      updateBroadcastTeamTargetState({
        teamCode,
        channels: fallbackChannels,
        activeChannels: teamCode === normalizeCode(currentTeam, DEFAULT_TEAM) ? [currentChannel] : []
      });
    });

  populateLoginSelectOptions(teamInput, currentLoginConfig.teamOptions, DEFAULT_TEAM);
  populateLoginSelectOptions(joinChannelInput, currentLoginConfig.channelOptions, DEFAULT_CHANNEL);
  setKnownTeamCodes(currentLoginConfig.teamOptions || [currentTeam || DEFAULT_TEAM]);
  (currentLoginConfig.teamOptions || [currentTeam || DEFAULT_TEAM]).forEach((teamCode) => {
    setKnownTeamChannels(teamCode, fallbackChannels);
  });
  renderTeams();

  renderJoinChecklists(currentLoginConfig, false);

  if (isAdminPortal) {
    if (joinTeamField) {
      joinTeamField.hidden = true;
      joinTeamField.style.display = "none";
    }
    if (joinChannelField) {
      joinChannelField.hidden = true;
      joinChannelField.style.display = "none";
    }
    if (teamInput) {
      teamInput.value = currentLoginConfig.teamOptions[0] || DEFAULT_TEAM;
    }
    if (joinChannelInput) {
      joinChannelInput.value = currentLoginConfig.channelOptions[0] || DEFAULT_CHANNEL;
    }

    selectedJoinTeamCodes = new Set([currentLoginConfig.teamOptions[0] || DEFAULT_TEAM]);
    selectedJoinChannelCodes = new Set([currentLoginConfig.channelOptions[0] || DEFAULT_CHANNEL]);
  } else {
    if (joinTeamField) {
      joinTeamField.hidden = !currentLoginConfig.showTeamSelect;
      joinTeamField.style.display = currentLoginConfig.showTeamSelect ? "" : "none";
    }
    if (joinChannelField) {
      joinChannelField.hidden = !currentLoginConfig.showChannelSelect;
      joinChannelField.style.display = currentLoginConfig.showChannelSelect ? "" : "none";
    }
  }

  if (teamInput && !currentLoginConfig.showTeamSelect) {
    teamInput.value = currentLoginConfig.teamOptions[0] || DEFAULT_TEAM;
  }

  if (joinChannelInput && !currentLoginConfig.showChannelSelect) {
    joinChannelInput.value = currentLoginConfig.channelOptions[0] || DEFAULT_CHANNEL;
  }

  if (!currentLoginConfig.showTeamSelect) {
    selectedJoinTeamCodes = new Set([currentLoginConfig.teamOptions[0] || DEFAULT_TEAM]);
  }

  if (!currentLoginConfig.showChannelSelect) {
    selectedJoinChannelCodes = new Set([currentLoginConfig.channelOptions[0] || DEFAULT_CHANNEL]);
  }

  applyPortalSelectionsFromQuery();
  syncLoginConfigAdminForm(currentLoginConfig);
};

const fetchLoginConfig = async () => {
  try {
    const response = await fetch("/api/login-config", {
      headers: { Accept: "application/json" }
    });
    if (!response.ok) {
      return;
    }

    const payload = await response.json();
    applyLoginConfigToJoinForm(payload?.config || null);
  } catch {
    // Keep default config when request fails.
  }
};

const fetchUploadConfig = async () => {
  try {
    const response = await fetch("/api/upload-config", {
      headers: { Accept: "application/json" }
    });
    if (!response.ok) {
      return;
    }

    const payload = await response.json();
    applyUploadConfig(payload?.config || null);
  } catch {
    // Keep default config when request fails.
  }
};

const fetchDirectAdminConfig = async () => {
  try {
    const response = await fetch("/api/direct-admin-config", {
      headers: { Accept: "application/json" }
    });
    if (!response.ok) {
      return;
    }

    const payload = await response.json();
    applyDirectAdminConfig(payload?.config || null);
  } catch {
    // Keep default config when request fails.
  }
};

const getJoinTeamCodeForMembersDirectory = () => {
  const fromSelection = Array.from(selectedJoinTeamCodes)
    .map((teamCode) => normalizeCode(teamCode, ""))
    .find(Boolean);
  if (fromSelection) {
    return fromSelection;
  }

  const fromForm = normalizeCode(teamInput?.value, "");
  if (fromForm) {
    return fromForm;
  }
  const fromQuery = normalizeCode(pageQuery.get("team"), "");
  if (fromQuery) {
    return fromQuery;
  }
  return normalizeCode(currentTeam, "");
};

const getSelectedJoinTeamCode = () => {
  return Array.from(selectedJoinTeamCodes)
    .map((teamCode) => normalizeCode(teamCode, ""))
    .find(Boolean)
    || "";
};

const getJoinChannelCodeForMembersDirectory = () => {
  const fromSelection = Array.from(selectedJoinChannelCodes)
    .map((channelCode) => normalizeCode(channelCode, ""))
    .find(Boolean);
  if (fromSelection) {
    return fromSelection;
  }

  const fromForm = normalizeCode(joinChannelInput?.value, "");
  if (fromForm) {
    return fromForm;
  }
  const fromQuery = normalizeCode(pageQuery.get("channel"), "");
  if (fromQuery) {
    return fromQuery;
  }
  return normalizeCode(currentChannel, "");
};

const getSelectedJoinChannelCode = () => {
  return Array.from(selectedJoinChannelCodes)
    .map((channelCode) => normalizeCode(channelCode, ""))
    .find(Boolean)
    || "";
};

const buildPortalUrl = (basePath) => {
  const teamCode = getJoinTeamCodeForMembersDirectory();
  const channelCode = getJoinChannelCodeForMembersDirectory();
  const params = new URLSearchParams();
  if (teamCode) {
    params.set("team", teamCode);
  }
  if (channelCode) {
    params.set("channel", channelCode);
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
};

const applyPortalSelectionsFromQuery = () => {
  const queryTeam = normalizeCode(pageQuery.get("team"), "");
  const queryChannel = normalizeCode(pageQuery.get("channel"), "");

  if (queryTeam) {
    selectedJoinTeamCodes = new Set([queryTeam]);
  }

  if (queryChannel) {
    selectedJoinChannelCodes = new Set([queryChannel]);
  }

  renderJoinChecklists(currentLoginConfig, false);
};

const closeRealMembersModal = () => {
  if (!realMembersModal) {
    return;
  }
  realMembersModal.classList.add("hidden");

  if (isRegistrationPortal) {
    window.location.href = buildPortalUrl("/login");
  }
};

const openRealMembersModal = async () => {
  if (!realMembersModal) {
    return;
  }

  if (isRegistrationPortal && joinModal) {
    joinModal.classList.add("hidden");
  }

  const teamCode = getJoinTeamCodeForMembersDirectory();
  const channelCode = getJoinChannelCodeForMembersDirectory();
  if (realMemberTeamPreview) {
    realMemberTeamPreview.value = teamCode;
  }
  if (realMemberChannelPreview) {
    realMemberChannelPreview.value = channelCode;
  }
  if (realMemberNameInput) {
    realMemberNameInput.value = normalizeDisplayName(nameInput?.value || "");
  }
  if (realMemberPasswordInput) {
    realMemberPasswordInput.value = "";
  }
  if (realMembersMeta) {
    realMembersMeta.textContent = `Daftarkan member baru untuk team ${teamCode} dan channel awal ${channelCode}. Akun member wajib login pakai password yang dibuat di sini.`;
  }
  realMembersModal.classList.remove("hidden");
  window.setTimeout(() => {
    try {
      realMemberNameInput?.focus({ preventScroll: true });
    } catch {
      realMemberNameInput?.focus();
    }
  }, 20);
};

const registerNewRealMember = async () => {
  const name = normalizeDisplayName(realMemberNameInput?.value || "");
  const password = String(realMemberPasswordInput?.value || "").trim();
  const teamCode = getJoinTeamCodeForMembersDirectory();
  const channelCode = getJoinChannelCodeForMembersDirectory();

  if (!name) {
    realMemberNameInput?.focus();
    if (realMembersMeta) {
      realMembersMeta.textContent = "Nama member baru wajib diisi.";
    }
    return;
  }

  if (!password || password.length < 4) {
    realMemberPasswordInput?.focus();
    if (realMembersMeta) {
      realMembersMeta.textContent = "Password member minimal 4 karakter.";
    }
    return;
  }

  if (realMembersMeta) {
    realMembersMeta.textContent = "Menyimpan pendaftaran member baru...";
  }

  const response = await fetch("/api/real-members/register", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      teamCode,
      password
    })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload?.ok) {
    throw new Error(payload?.message || "Pendaftaran member baru gagal.");
  }

  if (nameInput) {
    nameInput.value = name;
  }
  if (joinRoleSelect) {
    joinRoleSelect.value = "member";
    joinRoleSelect.dispatchEvent(new Event("change"));
  }
  if (joinPasswordInput) {
    joinPasswordInput.value = "";
  }
  if (realMembersMeta) {
    realMembersMeta.textContent = `Member ${name} berhasil didaftarkan untuk team ${teamCode}. Silakan login sebagai Member di channel ${channelCode} memakai password yang baru dibuat.`;
  }

  window.setTimeout(() => {
    if (joinChannelInput) {
      joinChannelInput.value = channelCode;
    }
    closeRealMembersModal();
  }, 450);
};

const normalizeDisplayName = (value) => {
  const compact = String(value || "")
    .replace(/\s+/g, " ")
    .trim();

  if (!compact) {
    return "";
  }

  return compact
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
};

const getNotificationTitle = (type) => {
  if (type === "success") {
    return "Berhasil";
  }
  if (type === "warning") {
    return "Peringatan";
  }
  if (type === "error") {
    return "Error";
  }
  return "Info";
};

const clearStatusNotice = () => {
  if (!throttleNotice) {
    return;
  }

  throttleNotice.textContent = "";
  throttleNotice.classList.remove("info", "success", "warning", "error");
  if (statusNoticeTimerId) {
    window.clearTimeout(statusNoticeTimerId);
    statusNoticeTimerId = null;
  }
};

const setStatusNotice = (message, type = "info", duration = 0) => {
  if (!throttleNotice) {
    return;
  }

  const text = String(message || "").trim();
  clearStatusNotice();
  if (!text) {
    return;
  }

  throttleNotice.textContent = text;
  throttleNotice.classList.add(type);

  if (duration > 0) {
    statusNoticeTimerId = window.setTimeout(() => {
      clearStatusNotice();
    }, duration);
  }
};

const showToast = (message, type = "info", duration = 3600) => {
  if (!notificationStack) {
    return;
  }

  const text = String(message || "").trim();
  if (!text) {
    return;
  }

  const toast = document.createElement("article");
  toast.className = `notification-toast ${type}`;

  const title = document.createElement("p");
  title.className = "notification-toast-title";
  title.textContent = getNotificationTitle(type);

  const body = document.createElement("p");
  body.className = "notification-toast-message";
  body.textContent = text;

  toast.appendChild(title);
  toast.appendChild(body);
  notificationStack.appendChild(toast);

  const dismiss = () => {
    toast.remove();
  };

  if (duration > 0) {
    window.setTimeout(dismiss, duration);
  }

  toast.addEventListener("click", dismiss);
};

const notify = (message, type = "info", options = {}) => {
  const showInline = options.inline !== false;
  const showToastUi = options.toast !== false;
  const inlineDuration = Number(options.inlineDuration) || 0;
  const toastDuration = Number(options.toastDuration) || 3600;

  if (showInline) {
    setStatusNotice(message, type, inlineDuration);
  }

  if (showToastUi) {
    showToast(message, type, toastDuration);
  }
};

const rememberIncomingMessageNotice = (messageId) => {
  if (!messageId) {
    return true;
  }

  if (incomingMessageNoticeIds.includes(messageId)) {
    return false;
  }

  incomingMessageNoticeIds.push(messageId);
  if (incomingMessageNoticeIds.length > MAX_INCOMING_NOTICE_IDS) {
    incomingMessageNoticeIds.splice(0, incomingMessageNoticeIds.length - MAX_INCOMING_NOTICE_IDS);
  }

  return true;
};

const maybeNotifyIncomingMessage = (message) => {
  if (!message || normalizeDisplayName(message?.user || "") === currentUser) {
    return;
  }

  const messageId = String(message?.id || "").trim();
  if (!rememberIncomingMessageNotice(messageId)) {
    return;
  }

  const senderName = normalizeDisplayName(message?.user || "User");
  const textContent = String(message?.text || "").trim() || "Pesan baru";
  const compactText = textContent.length > 90 ? `${textContent.slice(0, 90)}...` : textContent;
  notify(`${senderName}: ${compactText}`, "info", {
    inline: false,
    toast: true,
    toastDuration: 4200
  });

  if (!("Notification" in window)) {
    return;
  }

  if (Notification.permission === "default" && !hasRequestedBrowserNotificationPermission) {
    hasRequestedBrowserNotificationPermission = true;
    Notification.requestPermission().catch(() => {
      // Ignore permission prompt failures.
    });
    return;
  }

  if (Notification.permission !== "granted" || !document.hidden) {
    return;
  }

  const contextType = String(message?.context?.type || "").toLowerCase();
  const contextTitle = contextType === "dm"
    ? "DM baru"
    : `Channel #${normalizeCode(message?.context?.channelCode, currentChannel || DEFAULT_CHANNEL)}`;

  try {
    const browserNotice = new Notification(`${senderName} · ${contextTitle}`, {
      body: compactText,
      tag: messageId || `${senderName}-${Date.now()}`,
      renotify: false,
      silent: false
    });

    window.setTimeout(() => {
      browserNotice.close();
    }, 5000);
  } catch {
    // Ignore browser notification runtime errors.
  }
};

const configurePortalCopy = () => {
  document.body.classList.toggle("portal-admin", isAdminPortal);
  document.body.classList.toggle("admin-settings-mode", isAdminSettingsPortal);
  document.body.classList.toggle("portal-login", isMemberLoginPortal);
  document.body.classList.toggle("portal-registration", isRegistrationPortal);

  if (isAdminPortal) {
    document.title = "Admin Panel Login | LiveTeams";
    if (joinModalEyebrow) {
      joinModalEyebrow.textContent = "Login Admin Panel";
    }
    if (joinModalTitle) {
      joinModalTitle.textContent = "Akses panel admin";
    }
    if (nameInput) {
      nameInput.placeholder = "Contoh: admin utama";
    }
    if (joinSubmitPrimaryButton) {
      joinSubmitPrimaryButton.textContent = "Masuk Panel";
    }
    if (realMembersButton) {
      realMembersButton.classList.add("hidden");
    }
    if (joinPortalHelper) {
      joinPortalHelper.textContent = "Portal ini khusus role Admin, Owner, atau Operator.";
    }
  }

  if (isMemberLoginPortal) {
    document.title = "Login Member | LiveTeams";
    if (joinModalEyebrow) {
      joinModalEyebrow.textContent = "Login Member";
    }
    if (joinModalTitle) {
      joinModalTitle.textContent = "Masuk ke akun member";
    }
    if (nameInput) {
      nameInput.placeholder = "Nama member kamu";
    }
    if (joinSubmitPrimaryButton) {
      joinSubmitPrimaryButton.textContent = "Masuk Login";
    }
    if (realMembersButton) {
      realMembersButton.classList.remove("hidden");
      realMembersButton.textContent = "Daftar Member Baru";
    }
    if (joinPortalHelper) {
      joinPortalHelper.textContent = "Belum punya akun member? ";
      if (joinPortalLink) {
        joinPortalLink.textContent = "Daftar di sini";
        joinPortalLink.href = buildPortalUrl("/daftar");
        joinPortalHelper.appendChild(joinPortalLink);
      }
    }
  }

  if (isRegistrationPortal) {
    document.title = "Daftar Member | LiveTeams";
    if (realMembersModalEyebrow) {
      realMembersModalEyebrow.textContent = "Portal Pendaftaran";
    }
    if (realMembersModalTitle) {
      realMembersModalTitle.textContent = "Daftar Member Baru";
    }
    if (realMemberNameInput) {
      realMemberNameInput.placeholder = "Masukkan nama member baru";
    }
    if (realMembersCloseButton) {
      realMembersCloseButton.textContent = "Kembali ke Login";
    }
    if (realMembersSubmitButton) {
      realMembersSubmitButton.textContent = "Daftarkan Member";
    }
    if (realMembersPortalHelper) {
      realMembersPortalHelper.textContent = "Sudah punya akun member? ";
      if (realMembersPortalLink) {
        realMembersPortalLink.textContent = "Masuk login";
        realMembersPortalLink.href = buildPortalUrl("/login");
        realMembersPortalHelper.appendChild(realMembersPortalLink);
      }
    }
  }
};

const clearSavedMemberLogin = () => {
  try {
    window.localStorage.removeItem(MEMBER_LOGIN_STORAGE_KEY);
  } catch {
    // Ignore storage errors on restricted browsers.
  }

  try {
    window.sessionStorage.removeItem(ADMIN_PORTAL_SESSION_KEY);
  } catch {
    // Ignore storage errors on restricted browsers.
  }
};

const saveMemberLogin = () => {
  const normalizedRole = normalizeRole(currentRole);
  if (isAdminPortal && isPrivilegedRole(normalizedRole)) {
    const safeName = normalizeDisplayName(currentUser);
    const safePassword = String(currentAccessPassword || "").trim();

    if (!safeName || !safePassword) {
      try {
        window.sessionStorage.removeItem(ADMIN_PORTAL_SESSION_KEY);
      } catch {
        // Ignore storage errors on restricted browsers.
      }
      return;
    }

    const adminPayload = {
      name: safeName,
      teamCode: normalizeCode(currentTeam, DEFAULT_TEAM),
      channelCode: normalizeCode(currentChannel, DEFAULT_CHANNEL),
      role: normalizedRole,
      password: safePassword,
      savedAt: Date.now()
    };

    try {
      window.sessionStorage.setItem(ADMIN_PORTAL_SESSION_KEY, JSON.stringify(adminPayload));
    } catch {
      // Ignore storage errors on restricted browsers.
    }

    return;
  }

  if (normalizedRole !== "member") {
    try {
      window.localStorage.removeItem(MEMBER_LOGIN_STORAGE_KEY);
    } catch {
      // Ignore storage errors on restricted browsers.
    }
    return;
  }

  if (!normalizeCode(currentTeam, "") || !normalizeCode(currentChannel, "")) {
    try {
      window.localStorage.removeItem(MEMBER_LOGIN_STORAGE_KEY);
    } catch {
      // Ignore storage errors on restricted browsers.
    }
    return;
  }

  const safeName = normalizeDisplayName(currentUser);
  if (!safeName) {
    try {
      window.localStorage.removeItem(MEMBER_LOGIN_STORAGE_KEY);
    } catch {
      // Ignore storage errors on restricted browsers.
    }
    return;
  }

  const payload = {
    name: safeName,
    teamCode: normalizeCode(currentTeam, DEFAULT_TEAM),
    channelCode: normalizeCode(currentChannel, DEFAULT_CHANNEL),
    role: "member",
    savedAt: Date.now()
  };

  try {
    window.localStorage.setItem(MEMBER_LOGIN_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage errors on restricted browsers.
  }
};

const restoreSavedMemberLogin = () => {
  if (isRegistrationPortal) {
    clearSavedMemberLogin();
    return false;
  }

  if (isAdminPortal) {
    let adminParsed = null;
    try {
      const rawAdmin = window.sessionStorage.getItem(ADMIN_PORTAL_SESSION_KEY);
      if (!rawAdmin) {
        return false;
      }
      adminParsed = JSON.parse(rawAdmin);
    } catch {
      try {
        window.sessionStorage.removeItem(ADMIN_PORTAL_SESSION_KEY);
      } catch {
        // Ignore storage errors on restricted browsers.
      }
      return false;
    }

    const restoredRole = normalizeRole(adminParsed?.role || "");
    const restoredName = normalizeDisplayName(adminParsed?.name || "");
    const restoredPassword = String(adminParsed?.password || "").trim();
    if (!isPrivilegedRole(restoredRole) || !restoredName || !restoredPassword) {
      try {
        window.sessionStorage.removeItem(ADMIN_PORTAL_SESSION_KEY);
      } catch {
        // Ignore storage errors on restricted browsers.
      }
      return false;
    }

    currentUser = restoredName;
    currentTeam = normalizeCode(adminParsed?.teamCode, DEFAULT_TEAM);
    currentChannel = normalizeCode(adminParsed?.channelCode, DEFAULT_CHANNEL);
    currentRole = restoredRole;
    currentUserIsRegisteredMember = false;
    currentAccessPassword = restoredPassword;
    currentView = {
      type: "channel",
      channelCode: currentChannel,
      dmKey: "",
      peerName: "",
      supportScope: ""
    };

    if (nameInput) {
      nameInput.value = currentUser;
    }

    if (teamInput) {
      teamInput.value = currentTeam;
    }

    if (joinChannelInput) {
      joinChannelInput.value = currentChannel;
    }

    if (joinRoleSelect) {
      joinRoleSelect.value = currentRole;
      joinRoleSelect.dispatchEvent(new Event("change"));
    }

    if (joinPasswordInput) {
      joinPasswordInput.value = restoredPassword;
    }

    syncDmHistoryClearCutoffProfile();
    syncHiddenDmRoutesProfile();

    return true;
  }

  let parsed = null;

  try {
    const raw = window.localStorage.getItem(MEMBER_LOGIN_STORAGE_KEY);
    if (!raw) {
      return false;
    }
    parsed = JSON.parse(raw);
  } catch {
    clearSavedMemberLogin();
    return false;
  }

  const restoredName = normalizeDisplayName(parsed?.name || "");
  if (!restoredName) {
    clearSavedMemberLogin();
    return false;
  }

  currentUser = restoredName;
  currentTeam = normalizeCode(parsed?.teamCode, DEFAULT_TEAM);
  currentChannel = normalizeCode(parsed?.channelCode, DEFAULT_CHANNEL);
  currentRole = "member";
  currentUserIsRegisteredMember = false;
  currentAccessPassword = "";
  currentView = {
    type: "channel",
    channelCode: currentChannel,
    dmKey: "",
    peerName: "",
    supportScope: ""
  };

  if (nameInput) {
    nameInput.value = currentUser;
  }

  if (teamInput) {
    teamInput.value = currentTeam;
  }

  if (joinChannelInput) {
    joinChannelInput.value = currentChannel;
  }

  if (joinRoleSelect) {
    joinRoleSelect.value = getDefaultJoinRoleValue();
    joinRoleSelect.dispatchEvent(new Event("change"));
  }

  if (joinPasswordInput) {
    joinPasswordInput.value = "";
  }

  syncDmHistoryClearCutoffProfile();
  syncHiddenDmRoutesProfile();

  return true;
};

const buildDmHistoryClearCutoffProfileKey = () => {
  const safeUserName = normalizeDisplayName(currentUser || "");
  if (!safeUserName) {
    return "";
  }

  const safeTeamCode = normalizeCode(currentTeam, DEFAULT_TEAM);
  return `${safeTeamCode}::${safeUserName.toLowerCase()}`;
};

const readDmHistoryClearCutoffStorage = () => {
  try {
    const raw = window.localStorage.getItem(DM_HISTORY_CLEAR_CUTOFF_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const syncDmHistoryClearCutoffProfile = () => {
  const nextProfileKey = buildDmHistoryClearCutoffProfileKey();
  if (nextProfileKey === dmHistoryClearCutoffProfileKey) {
    return;
  }

  dmHistoryClearCutoffProfileKey = nextProfileKey;
  dmHistoryClearCutoffByKey.clear();

  if (!dmHistoryClearCutoffProfileKey) {
    return;
  }

  const store = readDmHistoryClearCutoffStorage();
  const profileData = store?.[dmHistoryClearCutoffProfileKey];
  if (!profileData || typeof profileData !== "object") {
    return;
  }

  Object.entries(profileData).forEach(([dmKey, cutoffMs]) => {
    const safeDmKey = String(dmKey || "").trim();
    const safeCutoffMs = Number(cutoffMs);
    if (!safeDmKey || !Number.isFinite(safeCutoffMs) || safeCutoffMs <= 0) {
      return;
    }

    dmHistoryClearCutoffByKey.set(safeDmKey, safeCutoffMs);
  });
};

const persistDmHistoryClearCutoffProfile = () => {
  if (!dmHistoryClearCutoffProfileKey) {
    return;
  }

  const store = readDmHistoryClearCutoffStorage();
  if (!store || typeof store !== "object") {
    return;
  }

  const serializedProfile = {};
  dmHistoryClearCutoffByKey.forEach((cutoffMs, dmKey) => {
    const safeDmKey = String(dmKey || "").trim();
    const safeCutoffMs = Number(cutoffMs);
    if (!safeDmKey || !Number.isFinite(safeCutoffMs) || safeCutoffMs <= 0) {
      return;
    }

    serializedProfile[safeDmKey] = safeCutoffMs;
  });

  if (Object.keys(serializedProfile).length === 0) {
    delete store[dmHistoryClearCutoffProfileKey];
  } else {
    store[dmHistoryClearCutoffProfileKey] = serializedProfile;
  }

  try {
    window.localStorage.setItem(DM_HISTORY_CLEAR_CUTOFF_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Ignore persistence failures on restricted browsers.
  }
};

const readHiddenDmRoutesStorage = () => {
  try {
    const raw = window.localStorage.getItem(DM_HIDDEN_ROUTES_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const syncHiddenDmRoutesProfile = () => {
  const nextProfileKey = buildDmHistoryClearCutoffProfileKey();
  if (nextProfileKey === hiddenDmRoutesProfileKey) {
    return;
  }

  hiddenDmRoutesProfileKey = nextProfileKey;
  hiddenDmRoutesByKey.clear();

  if (!hiddenDmRoutesProfileKey) {
    return;
  }

  const store = readHiddenDmRoutesStorage();
  const profileData = store?.[hiddenDmRoutesProfileKey];
  if (!Array.isArray(profileData)) {
    return;
  }

  profileData
    .map((dmKey) => String(dmKey || "").trim())
    .filter(Boolean)
    .forEach((dmKey) => {
      hiddenDmRoutesByKey.add(dmKey);
    });
};

const persistHiddenDmRoutesProfile = () => {
  if (!hiddenDmRoutesProfileKey) {
    return;
  }

  const store = readHiddenDmRoutesStorage();
  if (!store || typeof store !== "object") {
    return;
  }

  const serialized = Array.from(hiddenDmRoutesByKey)
    .map((dmKey) => String(dmKey || "").trim())
    .filter(Boolean);

  if (serialized.length === 0) {
    delete store[hiddenDmRoutesProfileKey];
  } else {
    store[hiddenDmRoutesProfileKey] = serialized;
  }

  try {
    window.localStorage.setItem(DM_HIDDEN_ROUTES_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Ignore persistence failures on restricted browsers.
  }
};

const emitJoinRequest = () => {
  if (!currentUser) {
    return;
  }

  const canUsePrivateMode = normalizeRole(currentRole) === "guest" || normalizeRole(currentRole) === "member";
  const isPrivateMode = canUsePrivateMode && !getSelectedJoinTeamCode() && !getSelectedJoinChannelCode();
  socket.emit("join:request", {
    name: currentUser,
    teamCode: currentTeam,
    channelCode: currentChannel,
    role: currentRole,
    password: currentAccessPassword,
    privateMode: isPrivateMode
  });
};

const focusMessageInputWithoutScroll = () => {
  if (!messageInput) {
    return;
  }

  try {
    messageInput.focus({ preventScroll: true });
  } catch {
    messageInput.focus();
  }
};

const logoutCurrentSession = () => {
  clearDemoBots({ silent: true });
  clearSavedMemberLogin();

  currentUser = "";
  currentTeam = DEFAULT_TEAM;
  currentChannel = DEFAULT_CHANNEL;
  currentRole = "member";
  currentUserIsRegisteredMember = false;
  currentAccessPassword = "";
  selectedJoinTeamCodes = new Set([DEFAULT_TEAM]);
  selectedJoinChannelCodes = new Set([DEFAULT_CHANNEL]);
  currentView = {
    type: "channel",
    channelCode: DEFAULT_CHANNEL,
    dmKey: "",
    peerName: "",
    supportScope: ""
  };

  dmConversations = [];
  dmConversationMeta.clear();
  dmHistoryClearCutoffByKey.clear();
  dmHistoryClearCutoffProfileKey = "";
  hiddenDmRoutesByKey.clear();
  hiddenDmRoutesProfileKey = "";
  pendingAutoOpenBroadcastDm = null;
  currentTeamMembers = [];
  currentPresenceUsers = [];
  currentAuthState = {
    hasOwner: false,
    ownerName: "",
    adminNames: [],
    operatorNames: []
  };

  pendingSettingsPassword = "";
  pendingDirectAdminAutoStartOnJoin = false;
  messageCache.clear();
  messageList.replaceChildren();
  typingIndicator.textContent = "";
  onlineCount.textContent = "0";

  if (settingsUsernameInput) {
    settingsUsernameInput.value = "";
  }
  if (settingsPasswordInput) {
    settingsPasswordInput.value = "";
  }

  if (nameInput) {
    nameInput.value = "";
  }
  if (teamInput) {
    teamInput.value = DEFAULT_TEAM;
  }
  if (joinChannelInput) {
    joinChannelInput.value = DEFAULT_CHANNEL;
  }
  if (joinRoleSelect) {
    joinRoleSelect.value = getDefaultJoinRoleValue();
    joinRoleSelect.dispatchEvent(new Event("change"));
  }
  if (joinPasswordInput) {
    joinPasswordInput.value = "";
  }
  if (joinDirectAdminInput) {
    joinDirectAdminInput.value = "admins";
  }

  renderChannels([DEFAULT_CHANNEL]);
  renderUsers([]);
  renderDmList();
  setHeader();
  setChatReadyState(false);
  notify("Kamu sudah logout.", "info", { inlineDuration: 2600, toast: false });
  closeMobileSidebar();

  joinModal.classList.remove("hidden");
  joinModal.hidden = false;
  try {
    nameInput.focus({ preventScroll: true });
  } catch {
    nameInput.focus();
  }

  const reconnectAfterLogout = () => {
    if (socket.connected) {
      socket.disconnect();
    }
    socket.connect();
  };

  if (socket.connected) {
    socket.emit("session:logout");
    window.setTimeout(reconnectAfterLogout, 60);
    return;
  }

  reconnectAfterLogout();
};

const isMobileSidebarViewport = () => window.innerWidth <= MOBILE_SIDEBAR_BREAKPOINT;
const MOBILE_VIEWPORT_HEIGHT_CSS_VAR = "--app-mobile-vh";

const isMobileKeyboardOpen = () => {
  const keyboardOffset = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--app-mobile-keyboard-offset") || "0"
  );

  return keyboardOffset > 24 || document.body.classList.contains("keyboard-open");
};

const syncMobileViewportHeight = () => {
  if (!document?.documentElement) {
    return;
  }

  const baseViewportHeight = Math.max(
    320,
    Math.round(
      Number(window.innerHeight)
      || Number(document.documentElement.clientHeight)
      || 0
    )
  );
  const visualViewportHeight = Math.max(0, Number(window.visualViewport?.height) || baseViewportHeight);
  const viewportOffsetTop = Math.max(0, Number(window.visualViewport?.offsetTop) || 0);
  const safeHeight = Math.max(320, Math.min(baseViewportHeight, Math.round(visualViewportHeight + viewportOffsetTop)));
  const rawKeyboardOffset = Math.max(0, Math.round(baseViewportHeight - visualViewportHeight - viewportOffsetTop));
  const inputFocused = document.activeElement === messageInput;
  const keyboardIsActive = isMobileSidebarViewport() && inputFocused && rawKeyboardOffset > 120;
  const effectiveKeyboardOffset = keyboardIsActive ? rawKeyboardOffset : 0;

  document.documentElement.style.setProperty(MOBILE_VIEWPORT_HEIGHT_CSS_VAR, `${safeHeight}px`);
  document.documentElement.style.setProperty("--app-mobile-keyboard-offset", `${effectiveKeyboardOffset}px`);
  document.body.classList.toggle("keyboard-open", keyboardIsActive);

  if (chatForm) {
    chatForm.classList.toggle("mobile-keyboard-sticky", keyboardIsActive);
  }
};

const ensureComposerVisible = () => {
  if (!chatForm || !messageInput) {
    return;
  }

  if (document.activeElement !== messageInput) {
    return;
  }

  requestAnimationFrame(() => {
    if (!chatForm || !messageInput || document.activeElement !== messageInput) {
      return;
    }

    if (messageList) {
      if (!shouldAutoScrollMessageList()) {
        return;
      }

      const maxScrollTop = Math.max(0, messageList.scrollHeight - messageList.clientHeight);
      if (messageList.scrollTop < maxScrollTop) {
        messageList.scrollTop = maxScrollTop;
      }
    }
  });
};

const scheduleComposerAdjustment = () => {
  if (keyboardAdjustmentTimerId) {
    window.clearTimeout(keyboardAdjustmentTimerId);
  }

  keyboardAdjustmentTimerId = window.setTimeout(() => {
    syncMobileViewportHeight();
    ensureComposerVisible();
  }, 90);
};

const mountMobileSidebarToggleToBody = () => {
  if (!mobileSidebarToggle || !document.body) {
    return;
  }

  if (mobileSidebarToggle.parentElement !== document.body) {
    document.body.appendChild(mobileSidebarToggle);
  }
};

const syncMobileSidebarToggleState = (isOpen) => {
  if (!mobileSidebarToggle) {
    return;
  }

  const open = Boolean(isOpen);
  mobileSidebarToggle.classList.toggle("active", open);
  mobileSidebarToggle.setAttribute("aria-expanded", open ? "true" : "false");
  mobileSidebarToggle.setAttribute("aria-label", open ? "Tutup panel" : "Buka panel");
  const toggleLabel = mobileSidebarToggle.querySelector(".menu-toggle-label");
  if (toggleLabel) {
    toggleLabel.textContent = open ? "Tutup panel" : "Buka panel";
  }
};

const closeMobileSidebar = () => {
  document.body.classList.remove("sidebar-open");
  if (sidebarCloseButton) {
    sidebarCloseButton.classList.add("hidden");
  }
  if (mobileSidebarBackdrop) {
    mobileSidebarBackdrop.classList.add("hidden");
  }
  syncMobileSidebarToggleState(false);
  updateSidebarScrollIndicators();
};

const openMobileSidebar = () => {
  if (!isMobileSidebarViewport()) {
    return;
  }

  document.body.classList.add("sidebar-open");
  if (sidebarCloseButton) {
    sidebarCloseButton.classList.remove("hidden");
  }
  if (mobileSidebarBackdrop) {
    mobileSidebarBackdrop.classList.remove("hidden");
  }
  syncMobileSidebarToggleState(true);
  requestAnimationFrame(() => {
    updateSidebarScrollIndicators();
    updateLiveChatRouteScrollIndicators();
  });
};

const toggleMobileSidebar = () => {
  if (document.body.classList.contains("sidebar-open")) {
    closeMobileSidebar();
    return;
  }

  openMobileSidebar();
};

const resetSidebarSwipeTracking = () => {
  sidebarTouchStartX = 0;
  sidebarTouchStartY = 0;
  sidebarTouchLastX = 0;
  sidebarTouchLastY = 0;
  sidebarSwipeTracking = false;
};

const formatClock = (isoDate) => {
  try {
    return new Date(isoDate).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return "";
  }
};

const formatFileSize = (bytes) => {
  const size = Number(bytes) || 0;
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const appendTextWithLinks = (element, text) => {
  const raw = String(text || "");
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
  let lastIndex = 0;
  let match = urlRegex.exec(raw);

  while (match) {
    const matchedUrl = match[0];
    const matchIndex = match.index;

    if (matchIndex > lastIndex) {
      element.appendChild(document.createTextNode(raw.slice(lastIndex, matchIndex)));
    }

    const link = document.createElement("a");
    const normalizedHref = matchedUrl.toLowerCase().startsWith("http") ? matchedUrl : `https://${matchedUrl}`;
    link.href = normalizedHref;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "message-link";
    link.textContent = matchedUrl;
    element.appendChild(link);

    lastIndex = matchIndex + matchedUrl.length;
    match = urlRegex.exec(raw);
  }

  if (lastIndex < raw.length) {
    element.appendChild(document.createTextNode(raw.slice(lastIndex)));
  }
};

const appendMessageContent = (element, text) => {
  const raw = String(text || "");
  const fenceRegex = /```([a-zA-Z0-9_+\-]*)\n?([\s\S]*?)```/g;

  let cursor = 0;
  let match = fenceRegex.exec(raw);

  while (match) {
    const fullMatch = match[0];
    const language = (match[1] || "").trim();
    const codeBody = match[2] || "";
    const matchStart = match.index;

    if (matchStart > cursor) {
      const plainText = raw.slice(cursor, matchStart);
      appendTextWithLinks(element, plainText);
    }

    const codeWrap = document.createElement("div");
    codeWrap.className = "message-code-block";

    const codeMeta = document.createElement("div");
    codeMeta.className = "message-code-meta";
    codeMeta.textContent = language || "code";

    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.textContent = codeBody;
    pre.appendChild(code);

    codeWrap.appendChild(codeMeta);
    codeWrap.appendChild(pre);
    element.appendChild(codeWrap);

    cursor = matchStart + fullMatch.length;
    match = fenceRegex.exec(raw);
  }

  if (cursor < raw.length) {
    appendTextWithLinks(element, raw.slice(cursor));
  }
};

const parseCodeBlocks = (text) => {
  const blocks = [];
  const raw = String(text || "");
  const fenceRegex = /```([a-zA-Z0-9_+\-]*)\n?([\s\S]*?)```/g;
  let match = fenceRegex.exec(raw);

  while (match) {
    blocks.push({
      language: String(match[1] || "").trim().toLowerCase(),
      code: String(match[2] || "")
    });
    match = fenceRegex.exec(raw);
  }

  return blocks;
};

const detectRawCodeLanguage = (text) => {
  const raw = String(text || "").trim();
  if (!raw) {
    return "";
  }

  const hasHtmlTag = /<([a-zA-Z][a-zA-Z0-9-]*)(\s|>)/.test(raw) && /<\//.test(raw);
  if (hasHtmlTag || /^<!doctype\s+html>/i.test(raw)) {
    return "html";
  }

  const cssSignal = /[.#]?[a-zA-Z0-9_-]+\s*\{[^}]*\}/.test(raw) || /@media\s*\(/.test(raw);
  if (cssSignal) {
    return "css";
  }

  const jsSignal = /(const|let|var|function|=>|console\.log|document\.|window\.|if\s*\(|for\s*\(|while\s*\()/i.test(raw);
  if (jsSignal) {
    return "js";
  }

  return "";
};

const getCodeBlocksForMessage = (text) => {
  const fencedBlocks = parseCodeBlocks(text);
  if (fencedBlocks.length > 0) {
    return fencedBlocks;
  }

  const raw = String(text || "").trim();
  const inferred = detectRawCodeLanguage(raw);
  if (!inferred) {
    return [];
  }

  return [{
    language: inferred,
    code: raw
  }];
};

const applyComposerCodeMode = (text) => {
  const raw = String(text || "").trim();
  if (!raw || !codeModeLanguage || codeModeLanguage === "off") {
    return raw;
  }

  if (parseCodeBlocks(raw).length > 0) {
    return raw;
  }

  return `\`\`\`${codeModeLanguage}\n${raw}\n\`\`\``;
};

const getCodeModeLabel = (value) => {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized || normalized === "off") {
    return "OFF";
  }

  if (normalized === "html") {
    return "HTML";
  }

  if (normalized === "css") {
    return "CSS";
  }

  if (normalized === "js") {
    return "JS";
  }

  return "CODE";
};

const closeCodeModeDropdown = () => {
  if (!codeModeDropdown || !codeModeMenu || !codeModeTrigger) {
    return;
  }

  codeModeDropdown.classList.remove("open");
  codeModeDropdown.classList.remove("drop-up");
  codeModeMenu.classList.add("hidden");
  codeModeMenu.style.visibility = "";
  codeModeTrigger.setAttribute("aria-expanded", "false");
};

const closeJoinRoleDropdown = () => {
  if (!joinRoleDropdown || !joinRoleMenu || !joinRoleTrigger) {
    return;
  }

  joinRoleDropdown.classList.remove("open");
  joinRoleDropdown.classList.remove("drop-up");
  joinRoleMenu.classList.add("hidden");
  joinRoleMenu.style.visibility = "";
  joinRoleTrigger.setAttribute("aria-expanded", "false");
};

const syncJoinRoleDropdownState = () => {
  if (!joinRoleSelect || !joinRoleTrigger || !joinRoleMenu) {
    return;
  }

  const selectedRole = String(joinRoleSelect.value || "guest").trim().toLowerCase();
  joinRoleTrigger.textContent = getJoinRoleUiLabel(selectedRole);

  joinRoleMenu.querySelectorAll("[data-join-role]").forEach((optionButton) => {
    const optionRole = String(optionButton.getAttribute("data-join-role") || "").trim().toLowerCase();
    const selected = optionRole === selectedRole;
    optionButton.classList.toggle("active", selected);
    optionButton.setAttribute("aria-selected", selected ? "true" : "false");
  });
};

const positionCodeModeDropdownMenu = () => {
  if (!codeModeDropdown || !codeModeMenu) {
    return;
  }

  codeModeDropdown.classList.remove("drop-up");
  codeModeMenu.style.visibility = "hidden";
  codeModeMenu.classList.remove("hidden");

  const hostRect = codeModeDropdown.getBoundingClientRect();
  const menuRect = codeModeMenu.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
  const spaceBelow = viewportHeight - hostRect.bottom;
  const spaceAbove = hostRect.top;
  const needOpenUp = spaceBelow < menuRect.height + 8 && spaceAbove > spaceBelow;

  codeModeDropdown.classList.toggle("drop-up", needOpenUp);
  codeModeMenu.style.visibility = "";
};

const positionJoinRoleDropdownMenu = () => {
  if (!joinRoleDropdown || !joinRoleMenu) {
    return;
  }

  joinRoleDropdown.classList.remove("drop-up");
  joinRoleMenu.style.visibility = "hidden";
  joinRoleMenu.classList.remove("hidden");

  const hostRect = joinRoleDropdown.getBoundingClientRect();
  const menuRect = joinRoleMenu.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
  const spaceBelow = viewportHeight - hostRect.bottom;
  const spaceAbove = hostRect.top;
  const needOpenUp = spaceBelow < menuRect.height + 8 && spaceAbove > spaceBelow;

  joinRoleDropdown.classList.toggle("drop-up", needOpenUp);
  joinRoleMenu.style.visibility = "";
};

const updateCodeModeSelectUI = () => {
  if (!codeModeSelect) {
    return;
  }

  const codeModeEnabled = ["html", "css", "js"].includes(codeModeLanguage);
  codeModeSelect.value = codeModeLanguage;
  codeModeSelect.classList.toggle("active", codeModeEnabled);

  if (codeModeDropdown && codeModeTrigger && codeModeMenu) {
    codeModeDropdown.classList.toggle("active", codeModeEnabled);
    codeModeDropdown.classList.toggle("off", codeModeLanguage === "off");
    codeModeTrigger.textContent = getCodeModeLabel(codeModeLanguage);

    const optionButtons = codeModeMenu.querySelectorAll("[data-code-mode]");
    optionButtons.forEach((button) => {
      const value = String(button.getAttribute("data-code-mode") || "").trim().toLowerCase();
      const isActive = value === codeModeLanguage;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  }
};

const onCodeModeSelectChange = () => {
  const nextLanguage = String(codeModeSelect?.value || "").trim().toLowerCase();
  codeModeLanguage = ["off", "html", "css", "js"].includes(nextLanguage) ? nextLanguage : "off";
  updateCodeModeSelectUI();

  notify(
    codeModeLanguage && codeModeLanguage !== "off"
      ? `Mode code aktif: ${codeModeLanguage.toUpperCase()}`
      : "Mode code dimatikan.",
    "info",
    { inlineDuration: 2200, toast: false }
  );
};

const getPreviewDocumentFromMessageText = (text) => {
  const codeBlocks = getCodeBlocksForMessage(text);
  if (!codeBlocks.length) {
    return null;
  }

  const htmlBlock = codeBlocks.find((block) => ["html", "htm", "xml"].includes(block.language));
  const cssBlocks = codeBlocks.filter((block) => block.language === "css").map((block) => block.code.trim());
  const jsBlocks = codeBlocks
    .filter((block) => ["js", "javascript", "ts", "typescript"].includes(block.language))
    .map((block) => block.code.trim());

  if (htmlBlock) {
    return htmlBlock.code;
  }

  if (!cssBlocks.length && !jsBlocks.length) {
    return null;
  }

  const styleTag = cssBlocks.length ? `<style>${cssBlocks.join("\n\n")}</style>` : "";
  const scriptTag = jsBlocks.length ? `<script>${jsBlocks.join("\n\n")}<\/script>` : "";

  return `<!doctype html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LiveTeams Preview</title>
  ${styleTag}
</head>
<body>
  <main style="padding:16px;font-family:system-ui,sans-serif;">
    <h3 style="margin-top:0;">Live Preview</h3>
    <p>Preview untuk kode CSS/JS dari chat.</p>
    <div id="app"></div>
  </main>
  ${scriptTag}
</body>
</html>`;
};

const openCodePreview = (message) => {
  if (!previewModal || !previewFrame) {
    return;
  }

  const doc = getPreviewDocumentFromMessageText(message?.text || "");
  if (!doc) {
    notify("Tambahkan blok kode html/css/js agar bisa dipreview.", "warning", { inlineDuration: 3200 });
    return;
  }

  previewFrame.srcdoc = doc;
  if (previewMeta) {
    previewMeta.textContent = `Preview dari pesan ${normalizeDisplayName(message?.user || "Unknown")}`;
  }

  previewModal.classList.remove("hidden");
};

const closeCodePreview = () => {
  if (!previewModal || !previewFrame) {
    return;
  }

  previewModal.classList.add("hidden");
  previewFrame.srcdoc = "";
};

const closeEditModal = () => {
  if (!editModal || !editMessageInput) {
    return;
  }

  editModal.classList.add("hidden");
  editMessageInput.value = "";
  activeEditMessageId = "";
};

const openEditModal = (message) => {
  if (!editModal || !editMessageInput) {
    return;
  }

  activeEditMessageId = String(message?.id || "").trim();
  if (!activeEditMessageId) {
    return;
  }

  editMessageInput.value = String(message?.text || "");
  editModal.classList.remove("hidden");
  editMessageInput.focus();
  editMessageInput.setSelectionRange(editMessageInput.value.length, editMessageInput.value.length);
};

const minutesAgoIso = (minutesAgo) => new Date(Date.now() - minutesAgo * 60 * 1000).toISOString();

const formatMessageTime = (message) => {
  const baseTime = formatClock(message.timestamp);
  return message.editedAt ? `${baseTime} • edited` : baseTime;
};

const getInitials = (name) => {
  const clean = normalizeDisplayName(name);
  if (!clean) {
    return "JT";
  }

  const parts = clean.split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]).join("").toUpperCase();
};

const getAvatarVariant = (name) => {
  const source = normalizeDisplayName(name) || "Guest";
  const lowerSource = source.toLowerCase();

  if (lowerSource.includes("liveteams ai") || /\bai\b/.test(lowerSource)) {
    return "ai";
  }

  const primaryName = source.split(/\s+/)[0].toLowerCase();

  if (FEMALE_NAME_HINTS.has(primaryName)) {
    return "female";
  }

  if (MALE_NAME_HINTS.has(primaryName)) {
    return "male";
  }

  // Common fallback: names ending with "a" are often female in local naming.
  if (primaryName.endsWith("a")) {
    return "female";
  }

  let score = 0;

  for (const char of source) {
    score += char.charCodeAt(0);
  }

  return score % 2 === 0 ? "female" : "male";
};

const renderBotAvatarGlyph = (element, glyphClass = "avatar-glyph-ai") => {
  const glyphAi = document.createElement("span");
  glyphAi.className = `avatar-glyph ${glyphClass}`;
  glyphAi.setAttribute("aria-hidden", "true");

  const antenna = document.createElement("span");
  antenna.className = "avatar-antenna";

  const core = document.createElement("span");
  core.className = "avatar-core";

  const eyeLeft = document.createElement("span");
  eyeLeft.className = "avatar-eye avatar-eye-left";

  const eyeRight = document.createElement("span");
  eyeRight.className = "avatar-eye avatar-eye-right";

  const mouth = document.createElement("span");
  mouth.className = "avatar-bot-mouth";

  core.appendChild(eyeLeft);
  core.appendChild(eyeRight);
  core.appendChild(mouth);
  glyphAi.appendChild(antenna);
  glyphAi.appendChild(core);
  element.appendChild(glyphAi);
};

const applyDefaultAvatar = (element, name, role = "") => {
  if (!element) {
    return;
  }

  const variant = getAvatarVariant(name);
  const normalizedRole = normalizeRole(role || "");
  element.classList.remove(
    "avatar-female",
    "avatar-male",
    "avatar-ai",
    "avatar-role-owner",
    "avatar-role-admin",
    "avatar-role-operator"
  );

  if (variant === "female") {
    element.classList.add("avatar-female");
  } else if (variant === "male") {
    element.classList.add("avatar-male");
  } else {
    element.classList.add("avatar-ai");
  }

  element.replaceChildren();

  if (variant === "ai") {
    renderBotAvatarGlyph(element, "avatar-glyph-ai");
    return;
  }

  const glyph = document.createElement("span");
  glyph.className = "avatar-glyph";
  glyph.setAttribute("aria-hidden", "true");

  const head = document.createElement("span");
  head.className = "avatar-head";

  const body = document.createElement("span");
  body.className = "avatar-body";

  glyph.appendChild(head);
  glyph.appendChild(body);
  element.appendChild(glyph);

  if (["owner", "admin", "operator"].includes(normalizedRole)) {
    const roleBadge = document.createElement("span");
    roleBadge.className = "avatar-role-badge";

    if (normalizedRole === "owner") {
      element.classList.add("avatar-role-owner");
      roleBadge.textContent = "OWN";
    } else if (normalizedRole === "admin") {
      element.classList.add("avatar-role-admin");
      roleBadge.textContent = "ADM";
    } else {
      element.classList.add("avatar-role-operator");
      roleBadge.textContent = "OPR";
    }

    roleBadge.setAttribute("aria-hidden", "true");
    element.appendChild(roleBadge);
  }
};

const getMessageRoleLabel = (name, role) => {
  const normalizedName = normalizeDisplayName(name);
  if (normalizedName === currentUser) {
    return "Kamu";
  }

  return getRoleLabel(role);
};

const renderTeamNotice = () => {
  if (!teamNoticeText) {
    return;
  }

  teamNoticeText.textContent = normalizeTeamNotice(currentTeamNotice, DEFAULT_TEAM_NOTICE);
};

const renderPinnedNotice = () => {
  if (!pinnedNotice || !pinnedNoticeText || !pinnedNoticeMeta) {
    return;
  }

  const isChannelView = currentView.type === "channel";
  const hasPinned = isChannelView && currentPinnedMessage && String(currentPinnedMessage.text || "").trim();
  pinnedNotice.classList.toggle("hidden", !hasPinned);

  if (!hasPinned) {
    return;
  }

  const pinned = currentPinnedMessage;
  pinnedNoticeText.textContent = String(pinned.text || "").trim();
  const sourceUser = normalizeDisplayName(pinned.user || "Unknown");
  const pinnedBy = normalizeDisplayName(pinned.pinnedBy || "Unknown");
  pinnedNoticeMeta.textContent = `Dari ${sourceUser} • Dipin oleh ${pinnedBy}`;

  if (pinnedNoticeClear) {
    const canClear = canPinMessages(normalizeRole(currentRole));
    pinnedNoticeClear.classList.toggle("hidden", !canClear);
  }
};

const BROADCAST_CHANNEL_TARGET_ACTIVE = "__ACTIVE_CHANNELS__";
const BROADCAST_CHANNEL_TARGET_ALL = "__ALL_CHANNELS__";

const hideBroadcastNotice = () => {
  if (broadcastNoticeTimerId) {
    window.clearTimeout(broadcastNoticeTimerId);
    broadcastNoticeTimerId = null;
  }

  if (broadcastNotice) {
    broadcastNotice.classList.add("hidden");
  }
};

if (broadcastNoticeClose) {
  broadcastNoticeClose.addEventListener("click", () => {
    hideBroadcastNotice();
  });
}

const showBroadcastNotice = (payload) => {
  if (!broadcastNotice || !broadcastNoticeText || !broadcastNoticeMeta) {
    return;
  }

  const text = String(payload?.text || "").trim();
  if (!text) {
    return;
  }

  const senderName = normalizeDisplayName(payload?.senderName || "Admin");
  const senderRole = getRoleLabel(normalizeRole(payload?.senderRole || "admin"));
  const durationMs = Math.max(3000, Math.min(180000, Number(payload?.durationMs) || 18000));
  const metaLabel = senderName || senderRole || "Admin";

  broadcastNoticeText.textContent = text;
  broadcastNoticeMeta.dataset.initial = metaLabel.charAt(0).toUpperCase();
  broadcastNoticeMeta.textContent = metaLabel;
  broadcastNotice.classList.remove("hidden");

  if (broadcastNoticeTimerId) {
    window.clearTimeout(broadcastNoticeTimerId);
  }

  broadcastNoticeTimerId = window.setTimeout(() => {
    hideBroadcastNotice();
  }, durationMs);
};

const updateBroadcastTeamTargetState = ({ teamCode, channels = [], activeChannels = [] } = {}) => {
  const safeTeamCode = normalizeCode(teamCode, "");
  if (!safeTeamCode) {
    return;
  }

  const safeChannels = Array.from(
    new Set(
      (Array.isArray(channels) ? channels : [DEFAULT_CHANNEL])
        .map((channelCode) => normalizeCode(channelCode, ""))
        .filter(Boolean)
    )
  );
  if (!safeChannels.includes(DEFAULT_CHANNEL)) {
    safeChannels.unshift(DEFAULT_CHANNEL);
  }

  const safeActiveChannels = Array.from(
    new Set(
      (Array.isArray(activeChannels) ? activeChannels : [])
        .map((channelCode) => normalizeCode(channelCode, ""))
        .filter(Boolean)
    )
  );

  if (!broadcastTargetTeams.includes(safeTeamCode)) {
    broadcastTargetTeams.push(safeTeamCode);
  }

  broadcastTargetTeams = Array.from(new Set(broadcastTargetTeams.map((code) => normalizeCode(code, "")).filter(Boolean)));
  broadcastChannelsByTeam.set(safeTeamCode, safeChannels);
  broadcastActiveChannelsByTeam.set(safeTeamCode, safeActiveChannels);
};

const closeBroadcastChecklistMenus = () => {
  [
    [broadcastTeamChecklistMenu, broadcastTeamChecklistTrigger],
    [broadcastChannelChecklistMenu, broadcastChannelChecklistTrigger],
    [broadcastRoleChecklistMenu, broadcastRoleChecklistTrigger]
  ].forEach(([menu, trigger]) => {
    if (!menu || !trigger) {
      return;
    }

    menu.classList.add("hidden");
    trigger.setAttribute("aria-expanded", "false");
  });
};

const closeJoinChecklistMenus = () => {
  [
    [joinTeamChecklistMenu, joinTeamChecklistTrigger],
    [joinChannelChecklistMenu, joinChannelChecklistTrigger]
  ].forEach(([menu, trigger]) => {
    if (!menu || !trigger) {
      return;
    }

    menu.classList.add("hidden");
    trigger.setAttribute("aria-expanded", "false");
  });
};

const closeBulkDeleteChecklistMenu = () => {
  if (!bulkDeleteScopeMenu || !bulkDeleteScopeTrigger) {
    return;
  }

  bulkDeleteScopeMenu.classList.add("hidden");
  bulkDeleteScopeTrigger.setAttribute("aria-expanded", "false");
};

const updateBulkDeleteScopeTriggerLabel = () => {
  if (!bulkDeleteScopeTrigger) {
    return;
  }

  bulkDeleteScopeTrigger.textContent = "Hapus Jalur Massal";
};

const syncBulkDeleteScopeSelection = () => {
  const nextSelection = new Set();
  if (bulkDeleteLiveChatToggle?.checked) {
    nextSelection.add("livechat");
  }
  if (bulkDeleteDmToggle?.checked) {
    nextSelection.add("directmessages");
  }
  selectedBulkDeleteTargets = nextSelection;
  updateBulkDeleteScopeTriggerLabel();
};

const emitBulkDeleteSelectedConversations = () => {
  if (!hasJoinedServer) {
    notify("Silakan join dulu sebelum hapus jalur massal.", "warning", { inlineDuration: 2600 });
    return;
  }

  if (!canManageRoles(normalizeRole(currentRole))) {
    notify("Hanya owner/admin yang bisa hapus jalur massal.", "warning", { inlineDuration: 2800 });
    return;
  }

  if (selectedBulkDeleteTargets.size === 0) {
    notify("Pilih minimal satu target: Live Chat atau Direct Messages.", "warning", { inlineDuration: 2600 });
    return;
  }

  const selectedConversations = dmConversations.filter((conversation) => {
    const meta = dmConversationMeta.get(conversation.dmKey) || null;
    const isSupport = isLiveChatSupportConversation(conversation, meta);
    if (isSupport && selectedBulkDeleteTargets.has("livechat")) {
      return true;
    }
    if (!isSupport && selectedBulkDeleteTargets.has("directmessages")) {
      return true;
    }
    return false;
  });

  const uniqueConversations = [];
  const seenDmKeys = new Set();
  selectedConversations.forEach((conversation) => {
    const dmKey = String(conversation?.dmKey || "").trim();
    if (!dmKey || seenDmKeys.has(dmKey)) {
      return;
    }
    seenDmKeys.add(dmKey);
    uniqueConversations.push(conversation);
  });

  if (uniqueConversations.length === 0) {
    notify("Tidak ada jalur yang cocok dengan checklist untuk dihapus.", "info", { inlineDuration: 2600 });
    return;
  }

  const targetLabels = [];
  if (selectedBulkDeleteTargets.has("livechat")) {
    targetLabels.push("Live Chat");
  }
  if (selectedBulkDeleteTargets.has("directmessages")) {
    targetLabels.push("Direct Messages");
  }

  const confirmed = window.confirm(
    `Hapus ${uniqueConversations.length} jalur dari ${targetLabels.join(" + ")} untuk akun kamu saja?`
  );

  if (!confirmed) {
    return;
  }

  const clearStartedAtMs = Date.now();
  let activeDmRouteRemoved = false;
  uniqueConversations.forEach((conversation) => {
    const dmKey = String(conversation?.dmKey || "").trim();
    if (!dmKey) {
      return;
    }

    suppressedEmptyDmKeys.add(dmKey);
    dmHistoryClearCutoffByKey.set(dmKey, clearStartedAtMs);
    hiddenDmRoutesByKey.add(dmKey);
    removeDmConversation(dmKey);

    if (currentView.type === "dm" && currentView.dmKey === dmKey) {
      activeDmRouteRemoved = true;
    }
  });

  if (activeDmRouteRemoved) {
    messageCache.clear();
    messageList.replaceChildren();
    renderTyping([]);
    switchToChannelView();
  }

  renderDmList();
  persistDmHistoryClearCutoffProfile();
  persistHiddenDmRoutesProfile();

  closeBulkDeleteChecklistMenu();
  notify(`Jalur dihapus dari daftar kamu: ${uniqueConversations.length} item.`, "warning", {
    inlineDuration: 3200,
    toast: false
  });
};

const getBroadcastSelectableChannels = () => {
  const currentTeamCode = normalizeCode(currentTeam, DEFAULT_TEAM);
  const channelSet = new Set();
  const allChannels = broadcastChannelsByTeam.get(currentTeamCode) || [DEFAULT_CHANNEL];
  const activeChannels = broadcastActiveChannelsByTeam.get(currentTeamCode) || [];
  const source = (activeChannels.length > 0 ? activeChannels : allChannels)
    .map((channelCode) => normalizeCode(channelCode, ""))
    .filter(Boolean);

  source.forEach((channelCode) => {
    channelSet.add(channelCode);
  });

  if (channelSet.size === 0) {
    channelSet.add(normalizeCode(currentChannel, DEFAULT_CHANNEL));
  }

  return Array.from(channelSet).sort((a, b) => a.localeCompare(b, "id"));
};

const updateBroadcastChecklistTriggerLabels = () => {
  if (broadcastTeamChecklistTrigger) {
    const total = selectedBroadcastTeamCodes.size;
    broadcastTeamChecklistTrigger.textContent = total > 0
      ? `Team dipilih (${total})`
      : "Pilih Team (Checklist)";
  }

  if (broadcastChannelChecklistTrigger) {
    const total = selectedBroadcastChannelCodes.size;
    broadcastChannelChecklistTrigger.textContent = total > 0
      ? `Channels dipilih (${total})`
      : "Pilih Channels (Checklist)";
  }

  if (broadcastRoleChecklistTrigger) {
    const labels = [];
    if (selectedBroadcastRecipientRoles.has("member")) {
      labels.push("Member");
    }
    if (selectedBroadcastRecipientRoles.has("guest")) {
      labels.push("Guest");
    }

    broadcastRoleChecklistTrigger.textContent = labels.length > 0
      ? `Penerima: ${labels.join(", ")}`
      : "Pilih Penerima (Checklist)";
  }
};

const createBroadcastChecklistItem = ({ label, checked, onToggle }) => {
  const item = document.createElement("label");
  item.className = "broadcast-checklist-item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = Boolean(checked);
  checkbox.addEventListener("change", () => {
    onToggle(Boolean(checkbox.checked));
  });

  const text = document.createElement("span");
  text.textContent = label;

  item.appendChild(checkbox);
  item.appendChild(text);
  return item;
};

const renderBroadcastChecklists = () => {
  if (broadcastTargetTeams.length === 0) {
    broadcastTargetTeams = [normalizeCode(currentTeam, DEFAULT_TEAM)];
  }

  const normalizedTeamSelection = new Set(
    Array.from(selectedBroadcastTeamCodes)
      .map((teamCode) => normalizeCode(teamCode, ""))
      .filter((teamCode) => broadcastTargetTeams.includes(teamCode))
  );
  selectedBroadcastTeamCodes = normalizedTeamSelection;

  if (broadcastTeamChecklistMenu) {
    broadcastTeamChecklistMenu.replaceChildren();
    broadcastTargetTeams
      .slice()
      .sort((a, b) => a.localeCompare(b, "id"))
      .forEach((teamCode) => {
        const item = createBroadcastChecklistItem({
          label: teamCode,
          checked: selectedBroadcastTeamCodes.has(teamCode),
          onToggle: (checked) => {
            if (checked) {
              selectedBroadcastTeamCodes.add(teamCode);
            } else {
              selectedBroadcastTeamCodes.delete(teamCode);
            }
            renderBroadcastChecklists();
          }
        });
        broadcastTeamChecklistMenu.appendChild(item);
      });
  }

  const availableChannels = getBroadcastSelectableChannels();
  const normalizedChannelSelection = new Set(
    Array.from(selectedBroadcastChannelCodes)
      .map((channelCode) => normalizeCode(channelCode, ""))
      .filter((channelCode) => availableChannels.includes(channelCode))
  );
  selectedBroadcastChannelCodes = normalizedChannelSelection;

  if (broadcastChannelChecklistMenu) {
    broadcastChannelChecklistMenu.replaceChildren();
    availableChannels.forEach((channelCode) => {
      const item = createBroadcastChecklistItem({
        label: `#${channelCode}`,
        checked: selectedBroadcastChannelCodes.has(channelCode),
        onToggle: (checked) => {
          if (checked) {
            selectedBroadcastChannelCodes.add(channelCode);
          } else {
            selectedBroadcastChannelCodes.delete(channelCode);
          }
          updateBroadcastChecklistTriggerLabels();
        }
      });
      broadcastChannelChecklistMenu.appendChild(item);
    });
  }

  if (broadcastRoleChecklistMenu) {
    broadcastRoleChecklistMenu.replaceChildren();
    [
      { value: "member", label: "Member" },
      { value: "guest", label: "Guest" }
    ].forEach((role) => {
      const item = createBroadcastChecklistItem({
        label: role.label,
        checked: selectedBroadcastRecipientRoles.has(role.value),
        onToggle: (checked) => {
          if (checked) {
            selectedBroadcastRecipientRoles.add(role.value);
          } else {
            selectedBroadcastRecipientRoles.delete(role.value);
          }
          updateBroadcastChecklistTriggerLabels();
        }
      });
      broadcastRoleChecklistMenu.appendChild(item);
    });
  }

  updateBroadcastChecklistTriggerLabels();
};

const getBroadcastStatusClock = () => {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(new Date());
  } catch {
    return new Date().toLocaleTimeString();
  }
};

const clearBroadcastSendPendingState = () => {
  if (broadcastSendPendingTimerId) {
    window.clearTimeout(broadcastSendPendingTimerId);
    broadcastSendPendingTimerId = null;
  }
  broadcastSendInFlight = false;
};

const setBroadcastSendSummary = (text = "", state = "idle", meta = "") => {
  if (!broadcastSendSummary || !broadcastSendStatusCard) {
    return;
  }

  const messageText = String(text || "").trim() || "Status kirim broadcast akan muncul di sini.";
  broadcastSendSummary.textContent = messageText;
  const safeState = String(state || "idle").trim().toLowerCase();
  broadcastSendStatusCard.dataset.state = safeState;

  if (broadcastSendMeta) {
    const metaText = String(meta || "").trim() || `Update ${getBroadcastStatusClock()}`;
    broadcastSendMeta.textContent = metaText;
  }
};

const formatAdminStatNumber = (value) => {
  const safeValue = Math.max(0, Number(value) || 0);
  return new Intl.NumberFormat("id-ID").format(safeValue);
};

const formatAdminStatTime = (isoValue) => {
  if (!isoValue) {
    return "Belum ada update";
  }

  const parsed = new Date(isoValue);
  if (Number.isNaN(parsed.getTime())) {
    return "Belum ada update";
  }

  return parsed.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
};

const renderAdminStatsSparkline = () => {
  if (!adminGlobalStatsSparkline) {
    return;
  }

  if (adminStatsHistory.length === 0) {
    adminGlobalStatsSparkline.innerHTML = "";
    return;
  }

  const width = 320;
  const height = 120;
  const paddingX = 10;
  const paddingY = 12;
  const usableWidth = width - (paddingX * 2);
  const usableHeight = height - (paddingY * 2);
  const maxOnline = Math.max(1, ...adminStatsHistory.map((sample) => sample.onlineUsers));

  const points = adminStatsHistory.map((sample, index) => {
    const x = paddingX + ((adminStatsHistory.length <= 1 ? 0 : index / (adminStatsHistory.length - 1)) * usableWidth);
    const y = paddingY + ((maxOnline - sample.onlineUsers) / maxOnline) * usableHeight;
    return { x, y };
  });

  const linePoints = points.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ");
  const areaPoints = [
    `${paddingX},${height - paddingY}`,
    ...points.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`),
    `${width - paddingX},${height - paddingY}`
  ].join(" ");

  adminGlobalStatsSparkline.setAttribute("viewBox", `0 0 ${width} ${height}`);
  adminGlobalStatsSparkline.innerHTML = `
    <defs>
      <linearGradient id="adminStatsAreaGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(113, 196, 255, 0.62)"></stop>
        <stop offset="100%" stop-color="rgba(113, 196, 255, 0.06)"></stop>
      </linearGradient>
    </defs>
    <line x1="${paddingX}" y1="${height - paddingY}" x2="${width - paddingX}" y2="${height - paddingY}" stroke="rgba(170, 210, 255, 0.24)" stroke-width="1"></line>
    <line x1="${paddingX}" y1="${paddingY}" x2="${paddingX}" y2="${height - paddingY}" stroke="rgba(170, 210, 255, 0.24)" stroke-width="1"></line>
    <polygon points="${areaPoints}" fill="url(#adminStatsAreaGradient)"></polygon>
    <polyline points="${linePoints}" fill="none" stroke="rgba(131, 205, 255, 0.95)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></polyline>
    <circle cx="${points[points.length - 1].x.toFixed(2)}" cy="${points[points.length - 1].y.toFixed(2)}" r="3.2" fill="#ffe29b"></circle>
  `;

  if (adminGlobalStatsPeak) {
    adminGlobalStatsPeak.textContent = `Puncak: ${formatAdminStatNumber(maxOnline)} online`;
  }
};

const appendAdminStatsHistory = (onlineUsers, updatedAt) => {
  const timestamp = new Date(updatedAt || Date.now()).getTime();
  const safeTimestamp = Number.isFinite(timestamp) ? timestamp : Date.now();
  const safeOnline = Math.max(0, Number(onlineUsers) || 0);
  const lastSample = adminStatsHistory[adminStatsHistory.length - 1] || null;

  if (lastSample && lastSample.onlineUsers === safeOnline && (safeTimestamp - lastSample.timestamp) < ADMIN_STATS_MIN_SAMPLE_GAP_MS) {
    lastSample.timestamp = safeTimestamp;
    lastSample.updatedAt = updatedAt;
    return;
  }

  if ((safeTimestamp - lastAdminStatsSampleAt) < 750 && lastSample && lastSample.onlineUsers !== safeOnline) {
    lastSample.onlineUsers = safeOnline;
    lastSample.timestamp = safeTimestamp;
    lastSample.updatedAt = updatedAt;
    return;
  }

  adminStatsHistory.push({
    onlineUsers: safeOnline,
    updatedAt,
    timestamp: safeTimestamp
  });

  while (adminStatsHistory.length > ADMIN_STATS_HISTORY_LIMIT) {
    adminStatsHistory.shift();
  }

  lastAdminStatsSampleAt = safeTimestamp;
};

const updateAdminRealtimeStats = ({
  onlineUsers,
  totalVisitors,
  memberOnline,
  guestOnline,
  updatedAt,
  source
}) => {
  const safeOnlineUsers = Math.max(0, Number(onlineUsers) || 0);
  const safeVisitors = Math.max(0, Number(totalVisitors) || 0);
  const safeMemberOnline = Math.max(0, Number(memberOnline) || 0);
  const safeGuestOnline = Math.max(0, Number(guestOnline) || 0);

  currentGlobalStats = {
    onlineUsers: safeOnlineUsers,
    memberOnline: safeMemberOnline,
    guestOnline: safeGuestOnline,
    totalVisitors: safeVisitors,
    updatedAt: String(updatedAt || new Date().toISOString()),
    source: String(source || "sinkronisasi server")
  };

  appendAdminStatsHistory(safeOnlineUsers, currentGlobalStats.updatedAt);

  if (adminGlobalOnlineTotal) {
    adminGlobalOnlineTotal.textContent = formatAdminStatNumber(safeOnlineUsers);
  }
  if (adminGlobalVisitorTotal) {
    adminGlobalVisitorTotal.textContent = formatAdminStatNumber(safeVisitors);
  }
  if (adminGlobalMemberOnline) {
    adminGlobalMemberOnline.textContent = formatAdminStatNumber(safeMemberOnline);
  }
  if (adminGlobalGuestOnline) {
    adminGlobalGuestOnline.textContent = formatAdminStatNumber(safeGuestOnline);
  }
  if (adminGlobalStatsUpdatedAt) {
    adminGlobalStatsUpdatedAt.textContent = `Update ${formatAdminStatTime(currentGlobalStats.updatedAt)}`;
  }
  if (adminGlobalStatsSource) {
    adminGlobalStatsSource.textContent = `Sumber: ${currentGlobalStats.source}`;
  }

  renderAdminStatsSparkline();
};

const renderAdminPanel = () => {
  if (!adminPanel || !adminPanelRole || !adminPanelHint || !adminList) {
    return;
  }

  const role = normalizeRole(currentRole);
  const canView = isAdminPortal && canManageRoles(role);

  adminPanel.classList.toggle("hidden", !canView);
  if (adminSettingsEntryLink) {
    adminSettingsEntryLink.classList.toggle("hidden", !canView);
    adminSettingsEntryLink.setAttribute("aria-current", isAdminSettingsPortal ? "page" : "false");
  }
  if (adminSettingsPage) {
    const showSettingsPage = canView && isAdminSettingsPortal;
    adminSettingsPage.classList.toggle("hidden", !showSettingsPage);
    adminSettingsPage.setAttribute("aria-hidden", showSettingsPage ? "false" : "true");
  }
  if (bulkDeleteWrap) {
    bulkDeleteWrap.classList.toggle("hidden", !canView);
  }

  if (!canView) {
    return;
  }

  const settingsOnlyWraps = [
    accountSettingsWrap,
    loginConfigWrap,
    uploadConfigWrap,
    directAdminConfigWrap
  ];

  settingsOnlyWraps.forEach((wrapElement) => {
    if (!wrapElement) {
      return;
    }

    // Keep these settings controls only in /admin/settings view.
    wrapElement.classList.toggle("hidden", !isAdminSettingsPortal);
  });

  // Broadcast section stays in /admin home only to avoid duplicate controls in settings page.
  if (broadcastMessageWrap) {
    broadcastMessageWrap.classList.toggle("hidden", isAdminSettingsPortal);
  }

  if (adminPanelTitle) {
    adminPanelTitle.textContent = isAdminSettingsPortal ? "Panel Management Settings" : "Panel Management";
  }

  adminPanelRole.textContent = getRoleLabel(role).toUpperCase();
  if (isAdminSettingsPortal) {
    adminPanelHint.textContent = "Halaman pengaturan panel management untuk akun, akses, dan statistik realtime admin.";
  } else {
    adminPanelHint.textContent = currentDirectAdminConfig.enabled
      ? "Owner/Admin bisa atur role member dan fitur chat langsung ke semua admin/owner."
      : "Owner/Admin bisa atur role member. Chat langsung ke admin saat ini OFF.";
  }

  if (settingsUsernameInput && document.activeElement !== settingsUsernameInput) {
    settingsUsernameInput.placeholder = `Username saat ini: ${currentUser || "-"}`;
  }

  updateBroadcastTeamTargetState({
    teamCode: currentTeam,
    channels: currentTeamChannels,
    activeChannels: [currentChannel]
  });

  if (broadcastDurationInput && document.activeElement !== broadcastDurationInput) {
    const currentValue = Number.parseInt(broadcastDurationInput.value, 10);
    if (!Number.isFinite(currentValue) || currentValue <= 0) {
      broadcastDurationInput.value = "18";
    }
  }

  renderBroadcastChecklists();

  const adminNames = Array.isArray(currentAuthState.adminNames) ? currentAuthState.adminNames : [];
  const operatorNames = Array.isArray(currentAuthState.operatorNames) ? currentAuthState.operatorNames : [];
  adminList.replaceChildren();

  if (adminNames.length === 0 && operatorNames.length === 0) {
    const empty = document.createElement("li");
    empty.className = "member-empty";
    empty.textContent = "Belum ada admin/operator yang ditandai.";
    adminList.appendChild(empty);
    return;
  }

  const appendRoleItems = (names, label) => {
    names
      .map((name) => normalizeDisplayName(name))
      .sort((a, b) => a.localeCompare(b, "id"))
      .forEach((name) => {
        const li = document.createElement("li");
        li.className = "admin-item";
        li.textContent = `${label} • @${name}`;
        adminList.appendChild(li);
      });
  };

  appendRoleItems(adminNames, "Admin");
  appendRoleItems(operatorNames, "Operator");
};

const setAdminSectionExpanded = (toggleElement, sectionElement, expanded) => {
  if (!toggleElement || !sectionElement) {
    return;
  }

  toggleElement.setAttribute("aria-expanded", expanded ? "true" : "false");
  sectionElement.classList.toggle("collapsed", !expanded);
};

const updateProfileCard = () => {
  const displayName = normalizeDisplayName(currentUser) || "Guest User";
  const statusOnline = connectionOnline && Boolean(currentUser);

  profileName.textContent = displayName;
  if (profileRegisteredBadge) {
    const showRegisteredBadge = Boolean(currentUser) && Boolean(currentUserIsRegisteredMember);
    profileRegisteredBadge.classList.toggle("hidden", !showRegisteredBadge);
    profileRegisteredBadge.setAttribute("aria-hidden", showRegisteredBadge ? "false" : "true");
    profileRegisteredBadge.setAttribute("title", showRegisteredBadge ? "Member terdaftar" : "");
  }
  profileRole.textContent = currentUser ? getRoleLabel(currentRole) : "Visitor";
  applyDefaultAvatar(profileAvatar, displayName);
  profileTeam.textContent = currentTeam || "Privat";
  profileChannel.textContent = currentView.type === "dm"
    ? `DM @${normalizeDisplayName(currentView.peerName)}`
    : currentChannel
      ? `#${currentChannel}`
      : "Privat";

  profileStatus.textContent = statusOnline ? "Online" : "Offline";
  profileStatus.classList.toggle("online", statusOnline);
  profileStatus.classList.toggle("offline", !statusOnline);

  if (logoutButton) {
    logoutButton.classList.toggle("hidden", !currentUser);
  }

  renderPinnedNotice();
  updateChannelFormAccess();

  if (!canUseDemoUsers(normalizeRole(currentRole)) && demoModeEnabled) {
    clearDemoBots({ silent: true });
  }

  updateDirectAdminActionVisibility();
  updateClearHistoryButtonState();
  renderAdminPanel();
};

const setConnectionState = (isOnline) => {
  connectionOnline = Boolean(isOnline);
  connectionStatus.textContent = connectionOnline ? "Connected" : "Disconnected";
  connectionStatus.classList.toggle("status-online", connectionOnline);
  connectionStatus.classList.toggle("status-offline", !connectionOnline);
  updateProfileCard();
};

const setHeader = () => {
  if (currentView.type === "dm") {
    const supportScope = String(currentView.supportScope || "").trim().toLowerCase();
    const isDirectAdminRoute = String(currentView.dmKey || "").toUpperCase().startsWith("ADMINSUPPORT::");
    const isSupportRoute = supportScope === "admins" || isDirectAdminRoute;
    roomLabel.textContent = supportScope === "admins" || isDirectAdminRoute
      ? "Live Chat"
      : (currentTeam ? `DM • TEAM ${currentTeam}` : "Live Chat");
    roomTitle.textContent = isSupportRoute
      ? "Customer Service"
      : `@${normalizeDisplayName(currentView.peerName)}`;
    backToChannelButton.classList.remove("hidden");
  } else {
    roomLabel.textContent = currentTeam ? `TEAM ${currentTeam}` : "PRIVATE CHAT";
    roomTitle.textContent = currentChannel ? `#${currentChannel}` : "DM Privat";
    backToChannelButton.classList.add("hidden");
  }

  updateClearHistoryButtonState();
  renderTeams();
  renderTeamNotice();
  renderPinnedNotice();
  updateProfileCard();
};

function updateClearHistoryButtonState() {
  if (!clearHistoryButton) {
    return;
  }

  const ready = Boolean(hasJoinedServer && currentUser);
  const role = normalizeRole(currentRole);
  const canClearChannelHistory = role === "admin";
  const canViewButton = ready && (currentView.type === "dm" || canClearChannelHistory);

  clearHistoryButton.classList.toggle("hidden", !canViewButton);
  clearHistoryButton.disabled = !canViewButton;

  if (!canViewButton) {
    clearHistoryButton.textContent = "Hapus History";
    return;
  }

  if (currentView.type === "dm") {
    clearHistoryButton.textContent = "Hapus History DM";
    return;
  }

  clearHistoryButton.textContent = "Hapus History Channel";
}

const buildAttachmentElement = (attachment) => {
  if (!attachment?.url) {
    return null;
  }

  const inferDownloadName = () => {
    const rawName = String(attachment.name || "").trim();
    if (rawName) {
      return rawName;
    }

    const mime = String(attachment.mimeType || "").toLowerCase();
    if (attachment.kind === "image") {
      if (mime.includes("png")) {
        return "image.png";
      }
      if (mime.includes("gif")) {
        return "image.gif";
      }
      if (mime.includes("webp")) {
        return "image.webp";
      }
      return "image.jpg";
    }

    if (attachment.kind === "video") {
      if (mime.includes("webm")) {
        return "video.webm";
      }
      if (mime.includes("ogg")) {
        return "video.ogv";
      }
      return "video.mp4";
    }

    if (attachment.kind === "audio") {
      if (mime.includes("ogg")) {
        return "audio.ogg";
      }
      if (mime.includes("wav")) {
        return "audio.wav";
      }
      return "audio.mp3";
    }

    return "file";
  };

  const getAttachmentFormatLabel = () => {
    const rawName = String(attachment.name || "").trim();
    if (rawName.includes(".")) {
      const ext = rawName.split(".").pop();
      if (ext) {
        return ext.toUpperCase();
      }
    }

    const mime = String(attachment.mimeType || "").toLowerCase();
    if (mime.includes("/")) {
      const subtype = mime.split("/")[1] || "";
      const normalizedSubtype = subtype.split("+")[0].replace(/^x-/, "").trim();
      if (normalizedSubtype) {
        return normalizedSubtype.toUpperCase();
      }
    }

    if (attachment.kind === "image") {
      return "JPG";
    }

    if (attachment.kind === "video") {
      return "MP4";
    }

    if (attachment.kind === "audio") {
      return "MP3";
    }

    return "FILE";
  };

  const wrap = document.createElement("div");
  wrap.className = "attachment";

  if (attachment.kind === "image") {
    const image = document.createElement("img");
    image.src = attachment.url;
    image.alt = attachment.name || "image";
    image.loading = "lazy";
    wrap.appendChild(image);
  }

  if (attachment.kind === "video") {
    const video = document.createElement("video");
    video.src = attachment.url;
    video.controls = true;
    video.preload = "metadata";
    wrap.appendChild(video);
  }

  if (attachment.kind === "audio") {
    const audio = document.createElement("audio");
    audio.src = attachment.url;
    audio.controls = true;
    audio.preload = "metadata";
    wrap.appendChild(audio);
  }

  const actions = document.createElement("div");
  actions.className = "attachment-actions";

  const downloadLink = document.createElement("a");
  downloadLink.href = attachment.url;
  downloadLink.setAttribute("download", inferDownloadName());
  downloadLink.className = "attachment-action-link attachment-download-link";
  downloadLink.textContent = "Download";
  actions.appendChild(downloadLink);

  const openLink = document.createElement("a");
  openLink.href = attachment.url;
  openLink.target = "_blank";
  openLink.rel = "noopener noreferrer";
  openLink.className = "attachment-action-link";
  openLink.textContent = "Buka";
  actions.appendChild(openLink);

  wrap.appendChild(actions);

  const meta = document.createElement("p");
  meta.className = "attachment-meta";
  meta.textContent = getAttachmentFormatLabel();
  wrap.appendChild(meta);

  return wrap;
};

const buildCopyText = (message) => {
  const parts = [];
  if (message?.text) {
    parts.push(message.text);
  }

  if (message?.attachment?.url) {
    parts.push(message.attachment.url);
  }

  return parts.join("\n").trim();
};

const getCachedMessageById = (messageId) => {
  const id = String(messageId || "").trim();
  if (!id) {
    return null;
  }

  return messageCache.get(id) || null;
};

const buildEditPayload = (message, text) => {
  const context = message?.context || {};

  if (context.type === "dm") {
    return {
      messageId: message.id,
      text,
      mode: "dm",
      dmKey: context.dmKey,
      peerName: context.peerName || currentView.peerName,
      supportScope: String(context.supportScope || currentView.supportScope || "") || undefined
    };
  }

  return {
    messageId: message.id,
    text,
    mode: "channel",
    channelCode: context.channelCode || currentChannel
  };
};

const patchMessageInView = (messagePatch) => {
  const messageId = String(messagePatch?.id || "").trim();
  if (!messageId) {
    return;
  }

  const existing = messageCache.get(messageId);
  if (!existing) {
    return;
  }

  const next = {
    ...existing,
    text: messagePatch.text,
    editedAt: messagePatch.editedAt || existing.editedAt
  };
  messageCache.set(messageId, next);

  const item = messageList.querySelector(`.message-item[data-message-id="${messageId}"]`);
  if (!item) {
    return;
  }

  const textElement = item.querySelector(".text");
  const timeElement = item.querySelector(".time");
  if (timeElement) {
    timeElement.textContent = formatMessageTime(next);
  }

  if (!textElement) {
    return;
  }

  textElement.replaceChildren();
  appendMessageContent(textElement, next.text || "");

  if (!next.text) {
    textElement.classList.add("hidden");
  } else {
    textElement.classList.remove("hidden");
  }
};

const isMessageListNearBottom = (thresholdOverride) => {
  if (!messageList) {
    return true;
  }

  const threshold = Number.isFinite(thresholdOverride)
    ? Math.max(0, Number(thresholdOverride))
    : Math.max(72, Math.round(messageList.clientHeight * 0.12));
  return messageList.scrollHeight - (messageList.scrollTop + messageList.clientHeight) <= threshold;
};

const updateMessageListScrollIndicators = () => {
  if (!messageList || !chatBodyShell) {
    return;
  }

  const maxScrollTop = Math.max(0, messageList.scrollHeight - messageList.clientHeight);
  const hasOverflow = maxScrollTop > 2;
  const nearTop = messageList.scrollTop <= 2;
  const nearBottom = maxScrollTop - messageList.scrollTop <= 2;

  chatBodyShell.classList.toggle("can-scroll-up", hasOverflow && !nearTop);
  chatBodyShell.classList.toggle("can-scroll-down", hasOverflow && !nearBottom);
};

function updateSidebarScrollIndicators() {
  if (!sidebarPanel) {
    return;
  }

  const maxScrollTop = Math.max(0, sidebarPanel.scrollHeight - sidebarPanel.clientHeight);
  const hasOverflow = maxScrollTop > 2;
  const nearTop = sidebarPanel.scrollTop <= 2;
  const nearBottom = maxScrollTop - sidebarPanel.scrollTop <= 2;

  sidebarPanel.classList.toggle("can-scroll-up", hasOverflow && !nearTop);
  sidebarPanel.classList.toggle("can-scroll-down", hasOverflow && !nearBottom);
}

function updateLiveChatRouteScrollIndicators() {
  if (!liveChatRouteList || !liveChatRouteCard) {
    return;
  }

  const maxScrollTop = Math.max(0, liveChatRouteList.scrollHeight - liveChatRouteList.clientHeight);
  const hasOverflow = maxScrollTop > 2;
  const nearTop = liveChatRouteList.scrollTop <= 2;
  const nearBottom = maxScrollTop - liveChatRouteList.scrollTop <= 2;

  liveChatRouteCard.classList.toggle("can-scroll-up", hasOverflow && !nearTop);
  liveChatRouteCard.classList.toggle("can-scroll-down", hasOverflow && !nearBottom);
}

const shouldAutoScrollMessageList = (options = {}) => {
  const { force = false } = options;
  if (force) {
    return true;
  }

  if (!messageList) {
    return false;
  }

  if (messageList.scrollHeight <= messageList.clientHeight + 2) {
    return true;
  }

  return !messageListUserInteracting;
};

const scrollMessageListToLatest = (options = {}) => {
  if (!messageList) {
    return;
  }

  const { force = false } = options;
  const composerIsActive = document.activeElement === messageInput;
  const keyboardIsOpen = isMobileKeyboardOpen();
  const nearBottom = isMessageListNearBottom();
  const autoFollowAllowed = shouldAutoScrollMessageList(options);

  if ((composerIsActive || keyboardIsOpen) && !force && !nearBottom && !autoFollowAllowed) {
    return;
  }

  const shouldScroll = force || autoFollowAllowed || nearBottom;
  if (!shouldScroll) {
    return;
  }

  requestAnimationFrame(() => {
    if (!messageList) {
      return;
    }

    const maxScrollTop = Math.max(0, messageList.scrollHeight - messageList.clientHeight);
    messageList.scrollTop = maxScrollTop;
    updateMessageListScrollIndicators();
  });
};

const pushMessage = (message, options = {}) => {
  const { forceScroll = false } = options;
  const shouldKeepAtBottom = forceScroll || shouldAutoScrollMessageList();

  const fragment = messageTemplate.content.cloneNode(true);
  const root = fragment.querySelector(".message-item");
  const row = fragment.querySelector(".message-row");
  const avatarElement = fragment.querySelector(".message-avatar");
  const bubble = fragment.querySelector(".bubble");
  const textElement = fragment.querySelector(".text");
  const roleLine = fragment.querySelector(".role-line");
  const roleBadge = fragment.querySelector(".role-badge");
  const crowdBadge = fragment.querySelector(".message-crowd-badge");
  const codeBlocks = getCodeBlocksForMessage(message.text || "");
  const hasCodeBlocks = codeBlocks.length > 0;
  root.dataset.messageId = message.id || "";

  messageCache.set(message.id, {
    ...message,
    user: normalizeDisplayName(message.user || "Unknown"),
    role: normalizeRole(message.role),
    simulated: Boolean(message.simulated)
  });

  const displayName = normalizeDisplayName(message.user || "Unknown");
  const isSelfMessage = displayName === currentUser;
  const isDmMessage = message?.context?.type === "dm";
  const isIncomingDmMessage = isDmMessage && !isSelfMessage;
  const isOutgoingDmMessage = isDmMessage && isSelfMessage;
  fragment.querySelector(".name").textContent = displayName;
  fragment.querySelector(".time").textContent = formatMessageTime(message);

  if (row) {
    row.classList.toggle("dm-row", isDmMessage);
  }

  root.classList.toggle("dm-item", isDmMessage);
  root.classList.toggle("dm-item-incoming", isIncomingDmMessage);
  root.classList.toggle("dm-item-outgoing", isOutgoingDmMessage);
  bubble.classList.toggle("dm-bubble", isDmMessage);
  bubble.classList.toggle("dm-bubble-incoming", isIncomingDmMessage);
  bubble.classList.toggle("dm-bubble-outgoing", isOutgoingDmMessage);

  if (avatarElement) {
    applyDefaultAvatar(avatarElement, displayName);
  }

  if (roleBadge) {
    roleBadge.textContent = getMessageRoleLabel(displayName, message.role);
    roleBadge.classList.toggle("self", isSelfMessage);
    roleBadge.classList.toggle("ai", roleBadge.textContent === "AI Helper");
    roleBadge.classList.toggle("owner", normalizeRole(message.role) === "owner");
    roleBadge.classList.toggle("admin", normalizeRole(message.role) === "admin");
    roleBadge.classList.toggle("operator", normalizeRole(message.role) === "operator");
  }

  if (isDmMessage && roleLine) {
    const dmDirectionBadge = document.createElement("span");
    dmDirectionBadge.className = "dm-direction-badge";
    dmDirectionBadge.classList.toggle("incoming", isIncomingDmMessage);
    dmDirectionBadge.classList.toggle("outgoing", isOutgoingDmMessage);
    dmDirectionBadge.textContent = isIncomingDmMessage ? "DM Masuk" : "DM Keluar";
    roleLine.prepend(dmDirectionBadge);
  }

  if (crowdBadge) {
    const isSimulatedMessage = Boolean(message.simulated);
    crowdBadge.classList.toggle("hidden", !isSimulatedMessage);
    crowdBadge.setAttribute("aria-hidden", isSimulatedMessage ? "false" : "true");
    crowdBadge.setAttribute("title", isSimulatedMessage ? "Member simulasi" : "");
  }

  textElement.replaceChildren();
  appendMessageContent(textElement, message.text || "");

  if (!message.text) {
    textElement.classList.add("hidden");
  } else {
    textElement.classList.remove("hidden");
  }

  const attachmentElement = buildAttachmentElement(message.attachment);
  if (attachmentElement) {
    bubble.appendChild(attachmentElement);
  }

  if (message.type !== "system") {
    const actionWrap = document.createElement("div");
    actionWrap.className = "message-actions";

    const messageId = message.id;

    if (hasCodeBlocks) {
      const copyButton = document.createElement("button");
      copyButton.type = "button";
      copyButton.className = "message-action-btn";
      copyButton.textContent = "Copy";
      copyButton.addEventListener("click", async () => {
        const latestMessage = getCachedMessageById(messageId) || message;
        const copyText = buildCopyText(latestMessage);
        if (!copyText) {
          return;
        }

        try {
          await navigator.clipboard.writeText(copyText);
          notify("Pesan berhasil disalin.", "success", { inline: false, toastDuration: 2400 });
        } catch {
          notify("Gagal menyalin pesan.", "error", { inline: false, toastDuration: 3200 });
        }
      });
      actionWrap.appendChild(copyButton);

      const previewButton = document.createElement("button");
      previewButton.type = "button";
      previewButton.className = "message-action-btn";
      previewButton.textContent = "Preview";
      previewButton.addEventListener("click", () => {
        const latestMessage = getCachedMessageById(messageId) || message;
        openCodePreview(latestMessage);
      });
      actionWrap.appendChild(previewButton);
    }

    if (hasCodeBlocks && normalizeDisplayName(message.user) === currentUser) {
      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.className = "message-action-btn";
      editButton.textContent = "Edit";
      editButton.addEventListener("click", () => {
        const latestMessage = getCachedMessageById(messageId) || message;
        const currentText = String(latestMessage.text || "");
        openEditModal(latestMessage);
      });

      actionWrap.appendChild(editButton);
    }

    const canPin = canPinMessages(normalizeRole(currentRole))
      && currentView.type === "channel"
      && message?.context?.type === "channel";

    if (canPin) {
      const pinButton = document.createElement("button");
      pinButton.type = "button";
      pinButton.className = "message-action-btn";
      pinButton.textContent = "Pin";
      pinButton.addEventListener("click", () => {
        const latestMessage = getCachedMessageById(messageId) || message;
        const nextText = String(latestMessage.text || "").trim();
        if (!nextText) {
          notify("Pesan kosong tidak bisa dipin.", "warning", { inlineDuration: 2800 });
          return;
        }

        socket.emit("chat:pin", {
          messageId: latestMessage.id,
          text: nextText,
          user: latestMessage.user,
          role: latestMessage.role,
          channelCode: currentChannel
        });
      });
      actionWrap.appendChild(pinButton);
    }

    if (actionWrap.childElementCount > 0) {
      bubble.appendChild(actionWrap);
    }
  }

  if (message.type === "system") {
    if (avatarElement) {
      avatarElement.classList.remove("avatar-female", "avatar-male", "avatar-ai");
      avatarElement.classList.add("avatar-system");
      avatarElement.replaceChildren();
      renderBotAvatarGlyph(avatarElement, "avatar-glyph-system");
    }

    if (row) {
      row.classList.add("system-row");
    }
    bubble.classList.add("system");
    root.classList.add("system-item");
  }

  messageList.appendChild(fragment);
  scrollMessageListToLatest({ force: shouldKeepAtBottom });
  requestAnimationFrame(() => {
    updateMessageListScrollIndicators();
  });
};

const emitChatMessage = ({ text, attachment }) => {
  const payload = {
    text,
    attachment
  };

  if (currentView.type === "dm") {
    const supportScope = String(currentView.supportScope || "").trim().toLowerCase();
    socket.emit("chat:message", {
      ...payload,
      mode: "dm",
      dmKey: currentView.dmKey,
      peerName: currentView.peerName,
      supportScope: supportScope || undefined
    });
    return;
  }

  socket.emit("chat:message", {
    ...payload,
    mode: "channel",
    channelCode: currentChannel
  });
};

const renderTyping = (typingUsers) => {
  const filtered = typingUsers
    .map((name) => normalizeDisplayName(name))
    .filter((name) => name !== currentUser);

  if (filtered.length === 0) {
    typingIndicator.textContent = "";
    return;
  }

  if (filtered.length === 1) {
    typingIndicator.textContent = `${filtered[0]} sedang mengetik...`;
    return;
  }

  typingIndicator.textContent = `${filtered.length} orang sedang mengetik...`;
};

const addDmConversation = (dmKey, peerName, options = {}) => {
  const normalizedPeer = normalizeDisplayName(peerName);
  const supportScope = String(options?.supportScope || "").trim().toLowerCase();
  if (!dmKey || !normalizedPeer) {
    return;
  }

  const existing = dmConversations.find((item) => item.dmKey === dmKey);
  if (existing) {
    existing.peerName = normalizedPeer;
    existing.supportScope = supportScope || existing.supportScope || "";
    return;
  }

  dmConversations.push({ dmKey, peerName: normalizedPeer, supportScope: supportScope || "" });
};

const removeDmConversation = (dmKey) => {
  const safeDmKey = String(dmKey || "").trim();
  if (!safeDmKey) {
    return;
  }

  const removedPeers = dmConversations
    .filter((conversation) => String(conversation?.dmKey || "").trim() === safeDmKey)
    .map((conversation) => normalizeDisplayName(conversation?.peerName || ""))
    .filter(Boolean);

  dmConversations = dmConversations.filter(
    (conversation) => String(conversation?.dmKey || "").trim() !== safeDmKey
  );

  dmConversationMeta.delete(safeDmKey);
  pendingDetachedDmMessages.delete(safeDmKey);
  removedPeers.forEach((peerName) => {
    pendingDetachedDmMessagesByPeer.delete(peerName);
  });
};

const formatDmMetaTime = (value) => {
  const dateValue = value ? new Date(value) : new Date();
  if (Number.isNaN(dateValue.getTime())) {
    return "";
  }

  try {
    return new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit"
    }).format(dateValue);
  } catch {
    return dateValue.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
};

const touchDmConversationMeta = ({ dmKey, text = "", timestamp = null, increaseUnread = false }) => {
  const safeDmKey = String(dmKey || "").trim();
  if (!safeDmKey) {
    return;
  }

  const existing = dmConversationMeta.get(safeDmKey) || {
    unreadCount: 0,
    previewText: "Belum ada pesan",
    timestamp: "",
    timestampRaw: "",
    activityMs: 0,
    isBroadcast: false,
    supportScope: ""
  };

  const rawTimestamp = String(timestamp || "").trim();
  const parsedActivityMs = rawTimestamp ? Date.parse(rawTimestamp) : Number.NaN;
  const activityMs = Number.isFinite(parsedActivityMs)
    ? parsedActivityMs
    : Date.now();
  const previewText = String(text || "").trim() || existing.previewText || "Belum ada pesan";
  const unreadCount = increaseUnread ? (existing.unreadCount || 0) + 1 : (existing.unreadCount || 0);
  dmConversationMeta.set(safeDmKey, {
    unreadCount,
    previewText,
    timestamp: formatDmMetaTime(timestamp || new Date()),
    timestampRaw: rawTimestamp || existing.timestampRaw || "",
    activityMs,
    isBroadcast: Boolean(existing.isBroadcast),
    supportScope: String(existing.supportScope || "")
  });
};

const markDmConversationBroadcast = (dmKey, isBroadcast) => {
  const safeDmKey = String(dmKey || "").trim();
  if (!safeDmKey) {
    return;
  }

  const existing = dmConversationMeta.get(safeDmKey) || {
    unreadCount: 0,
    previewText: "Belum ada pesan",
    timestamp: "",
    timestampRaw: "",
    activityMs: 0,
    isBroadcast: false,
    supportScope: ""
  };

  dmConversationMeta.set(safeDmKey, {
    ...existing,
    isBroadcast: Boolean(isBroadcast)
  });
};

const markDmConversationSupportScope = (dmKey, supportScope) => {
  const safeDmKey = String(dmKey || "").trim();
  if (!safeDmKey) {
    return;
  }

  const normalizedScope = String(supportScope || "").trim().toLowerCase();
  const existing = dmConversationMeta.get(safeDmKey) || {
    unreadCount: 0,
    previewText: "Belum ada pesan",
    timestamp: "",
    timestampRaw: "",
    activityMs: 0,
    isBroadcast: false,
    supportScope: ""
  };

  dmConversationMeta.set(safeDmKey, {
    ...existing,
    supportScope: normalizedScope
  });
};

const clearDmConversationUnread = (dmKey) => {
  const safeDmKey = String(dmKey || "").trim();
  if (!safeDmKey || !dmConversationMeta.has(safeDmKey)) {
    return;
  }

  const existing = dmConversationMeta.get(safeDmKey);
  dmConversationMeta.set(safeDmKey, {
    ...existing,
    unreadCount: 0
  });
};

const ensureDmConversationUnread = (dmKey, minimumUnread = 1) => {
  const safeDmKey = String(dmKey || "").trim();
  if (!safeDmKey) {
    return;
  }

  const existing = dmConversationMeta.get(safeDmKey) || {
    unreadCount: 0,
    previewText: "Belum ada pesan",
    timestamp: "",
    timestampRaw: "",
    activityMs: 0,
    isBroadcast: false,
    supportScope: ""
  };

  const nextUnread = Math.max(Number(existing.unreadCount || 0), Math.max(0, Number(minimumUnread || 0)));
  dmConversationMeta.set(safeDmKey, {
    ...existing,
    unreadCount: nextUnread
  });
};

const buildDmPreviewFallbackMessage = ({ dmKey, peerName, meta }) => {
  const safeDmKey = String(dmKey || "").trim();
  const safePeerName = normalizeDisplayName(peerName || "");
  const previewText = String(meta?.previewText || "").trim();
  if (!safeDmKey || !safePeerName || !previewText || previewText === "Belum ada pesan") {
    return null;
  }

  const rawTimestamp = String(meta?.timestampRaw || "").trim();
  const hasValidRawTimestamp = rawTimestamp && !Number.isNaN(new Date(rawTimestamp).getTime());
  const safeTimestamp = hasValidRawTimestamp ? rawTimestamp : new Date().toISOString();
  const fallbackIdSeed = hasValidRawTimestamp ? rawTimestamp : Date.now();

  return {
    id: `dm-fallback-${safeDmKey}-${fallbackIdSeed}`,
    type: "chat",
    user: safePeerName,
    role: Boolean(meta?.isBroadcast) ? "admin" : "member",
    text: previewText,
    timestamp: safeTimestamp,
    editedAt: null,
    attachment: null,
    context: {
      type: "dm",
      dmKey: safeDmKey,
      peerName: safePeerName,
      isBroadcast: Boolean(meta?.isBroadcast),
      supportScope: String(meta?.supportScope || "")
    }
  };
};

const normalizeDmListFilter = (value) => {
  const normalized = String(value || "").trim().toLowerCase();
  return normalized === "unread" ? "unread" : "all";
};

const syncDmFilterControls = () => {
  const controls = [liveChatFilterControls, dmFilterControls];
  controls.forEach((container) => {
    if (!container) {
      return;
    }

    const buttons = container.querySelectorAll("[data-dm-filter]");
    buttons.forEach((button) => {
      const filterValue = normalizeDmListFilter(button.getAttribute("data-dm-filter"));
      const isActive = filterValue === currentDmListFilter;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  });
};

const setDmListFilter = (nextFilter) => {
  const normalized = normalizeDmListFilter(nextFilter);
  if (normalized === currentDmListFilter) {
    return;
  }

  currentDmListFilter = normalized;
  syncDmFilterControls();
  renderDmList();
};

const bindDmFilterControls = (container) => {
  if (!container) {
    return;
  }

  container.addEventListener("click", (event) => {
    const targetButton = event.target.closest("[data-dm-filter]");
    if (!targetButton || !container.contains(targetButton)) {
      return;
    }

    setDmListFilter(targetButton.getAttribute("data-dm-filter"));
  });
};

const renderDmList = () => {
  const renderConversationCollection = (listElement, conversations, emptyText) => {
    if (!listElement) {
      return;
    }

    listElement.replaceChildren();

    const isUnreadOnlyFilter = currentDmListFilter === "unread";
    const filteredConversations = isUnreadOnlyFilter
      ? conversations.filter((conversation) => {
        const meta = dmConversationMeta.get(conversation.dmKey) || null;
        return Number(meta?.unreadCount || 0) > 0;
      })
      : conversations;

    if (!Array.isArray(filteredConversations) || filteredConversations.length === 0) {
      const empty = document.createElement("li");
      empty.className = "dm-empty";
      empty.textContent = isUnreadOnlyFilter ? "Tidak ada chat belum dibuka" : emptyText;
      listElement.appendChild(empty);
      if (listElement === liveChatRouteList) {
        requestAnimationFrame(() => {
          updateLiveChatRouteScrollIndicators();
        });
      }
      return;
    }

    const sortedConversations = [...filteredConversations].sort((left, right) => {
      const leftMeta = dmConversationMeta.get(left.dmKey) || null;
      const rightMeta = dmConversationMeta.get(right.dmKey) || null;
      const leftUnread = Number(leftMeta?.unreadCount || 0);
      const rightUnread = Number(rightMeta?.unreadCount || 0);

      if (leftUnread !== rightUnread) {
        return rightUnread - leftUnread;
      }

      const leftActivity = Number(leftMeta?.activityMs || Date.parse(String(leftMeta?.timestampRaw || "")) || 0);
      const rightActivity = Number(rightMeta?.activityMs || Date.parse(String(rightMeta?.timestampRaw || "")) || 0);
      if (leftActivity !== rightActivity) {
        return rightActivity - leftActivity;
      }

      return normalizeDisplayName(left.peerName).localeCompare(normalizeDisplayName(right.peerName), "id");
    });

    sortedConversations.forEach((conversation) => {
    const meta = dmConversationMeta.get(conversation.dmKey) || {
      unreadCount: 0,
      previewText: "Belum ada pesan",
      timestamp: "",
      timestampRaw: "",
      activityMs: 0,
      isBroadcast: false,
      supportScope: ""
    };
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "dm-item";
    button.classList.toggle("active", currentView.type === "dm" && currentView.dmKey === conversation.dmKey);

    const inner = document.createElement("span");
    inner.className = "dm-item-inner";

    const topRow = document.createElement("span");
    topRow.className = "dm-item-top";

    const nameText = document.createElement("span");
    nameText.className = "dm-item-name";
    const isSupportConversation = isLiveChatSupportConversation(conversation, meta);
    const requesterName = normalizeDisplayName(conversation.peerName);
    nameText.textContent = isSupportConversation
      ? (isAdminPortal ? requesterName || "User" : "Customer Service")
      : `@${conversation.peerName}`;

    if (meta.isBroadcast) {
      const broadcastBadge = document.createElement("span");
      broadcastBadge.className = "dm-origin-badge";
      broadcastBadge.textContent = "Broadcast Admin";
      nameText.appendChild(broadcastBadge);
    }

    if (String(conversation.supportScope || "").toLowerCase() === "admins") {
      const supportBadge = document.createElement("span");
      supportBadge.className = "dm-origin-badge";
      supportBadge.textContent = "Support Admin";
      nameText.appendChild(supportBadge);
    }

    const rightInfo = document.createElement("span");
    rightInfo.className = "dm-item-right";
    if (meta.timestamp) {
      const timeText = document.createElement("span");
      timeText.className = "dm-item-time";
      timeText.textContent = meta.timestamp;
      rightInfo.appendChild(timeText);
    }

    if (meta.unreadCount > 0) {
      const unreadBadge = document.createElement("span");
      unreadBadge.className = "dm-unread-badge";
      unreadBadge.textContent = String(meta.unreadCount > 99 ? "99+" : meta.unreadCount);
      rightInfo.appendChild(unreadBadge);
      button.classList.add("has-unread");
    }

    topRow.appendChild(nameText);
    topRow.appendChild(rightInfo);

    const previewText = document.createElement("span");
    previewText.className = "dm-item-preview";
    const previewPrefix = meta.isBroadcast ? "Broadcast: " : "";
    previewText.textContent = meta.unreadCount > 0
      ? `Pesan baru: ${previewPrefix}${meta.previewText}`
      : `${previewPrefix}${meta.previewText}`;

    inner.appendChild(topRow);
    inner.appendChild(previewText);
    button.appendChild(inner);

    button.addEventListener("click", () => {
      const supportScope = String(conversation.supportScope || meta.supportScope || "").trim().toLowerCase();
      const pendingByKey = pendingDetachedDmMessages.get(conversation.dmKey);
      const pendingByPeer = pendingDetachedDmMessagesByPeer.get(normalizeDisplayName(conversation.peerName));
      const pendingMessage = pendingByKey
        || pendingByPeer
        || buildDmPreviewFallbackMessage({
          dmKey: conversation.dmKey,
          peerName: conversation.peerName,
          meta
        });
      if (pendingMessage?.id) {
        switchToDmView({
          dmKey: conversation.dmKey,
          peerName: conversation.peerName,
          supportScope,
          history: [pendingMessage]
        });
      }

      socket.emit("dm:open", {
        peerName: conversation.peerName,
        dmKey: conversation.dmKey,
        supportScope: supportScope || undefined
      });
    });

    li.appendChild(button);
      listElement.appendChild(li);
    });

    if (listElement === liveChatRouteList) {
      requestAnimationFrame(() => {
        updateLiveChatRouteScrollIndicators();
      });
    }
    if (listElement === dmList) {
      requestAnimationFrame(() => {
        listElement.scrollTop = 0;
      });
    }
  };

  const supportConversations = dmConversations.filter((conversation) => {
    const meta = dmConversationMeta.get(conversation.dmKey) || null;
    return isLiveChatSupportConversation(conversation, meta);
  });

  const regularConversations = isAdminPortal
    ? dmConversations.filter((conversation) => {
      const meta = dmConversationMeta.get(conversation.dmKey) || null;
      return !isLiveChatSupportConversation(conversation, meta);
    })
    : dmConversations;

  if (liveChatRouteCard) {
    liveChatRouteCard.classList.toggle("hidden", !isAdminPortal);
  }

  if (isAdminPortal && liveChatRouteList) {
    renderConversationCollection(liveChatRouteList, supportConversations, "Belum ada jalur Live Chat");
  }

  renderConversationCollection(dmList, regularConversations, "Belum ada DM");
};

const renderChannels = (channels) => {
  if (!channelList) {
    return;
  }

  if (!currentTeam && currentView.type === "dm") {
    channelList.replaceChildren();
    const item = document.createElement("li");
    item.className = "channel-empty-state";
    item.textContent = "Mode privat tanpa channels.";
    channelList.appendChild(item);
    return;
  }

  setKnownTeamChannels(currentTeam, channels);
  currentTeamChannels = Array.from(
    new Set(
      (Array.isArray(channels) ? channels : [DEFAULT_CHANNEL])
        .map((channelCode) => normalizeCode(channelCode, ""))
        .filter(Boolean)
    )
  );

  if (!currentTeamChannels.includes(DEFAULT_CHANNEL)) {
    currentTeamChannels.unshift(DEFAULT_CHANNEL);
  }

  const activeChannelCodes = Array.from(
    new Set(
      (Array.isArray(channels) ? channels : [])
        .map((channelCode) => normalizeCode(channelCode, ""))
        .filter(Boolean)
    )
  );

  updateBroadcastTeamTargetState({
    teamCode: currentTeam,
    channels: currentTeamChannels,
    activeChannels: activeChannelCodes
  });

  renderAdminPanel();
  channelList.replaceChildren();

  channels.forEach((channelCode) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = pendingChannelSwitchCode === channelCode ? `#${channelCode} - pindah...` : `#${channelCode}`;
    button.className = "channel-item";
    button.dataset.channel = channelCode;
    button.classList.toggle("active", currentView.type === "channel" && channelCode === currentChannel);
    button.classList.toggle("pending", pendingChannelSwitchCode === channelCode);
    button.disabled = Boolean(pendingChannelSwitchCode) || Boolean(pendingTeamSwitchCode);
    button.setAttribute("aria-busy", pendingChannelSwitchCode === channelCode ? "true" : "false");

    button.addEventListener("click", () => {
      requestChannelSwitch(channelCode);
    });

    item.appendChild(button);
    channelList.appendChild(item);
  });
};

const shuffleArray = (items) => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
};

const getTargetAutoCrowdOnlineCount = (totalMembers) => {
  const safeTotal = Math.max(0, Number(totalMembers) || 0);
  if (safeTotal === 0) {
    return 0;
  }

  const minOnline = Math.min(AUTO_CROWD_ONLINE_MIN, safeTotal);
  const maxOnline = Math.min(Math.max(AUTO_CROWD_ONLINE_MAX, minOnline), safeTotal);
  const spread = Math.max(0, maxOnline - minOnline);
  return minOnline + Math.floor(Math.random() * (spread + 1));
};

const buildMemberDirectory = () => {
  const membersById = new Map();
  const isSupportConversation = (conversation) => {
    const supportScope = String(conversation?.supportScope || "").trim().toLowerCase();
    const dmKey = String(conversation?.dmKey || "").trim().toUpperCase();
    return supportScope === "admins" || dmKey.startsWith("ADMINSUPPORT::");
  };

  const upsertMember = (member, fallback = {}) => {
    if (!member || typeof member !== "object") {
      return;
    }

    const normalizedRole = normalizeRole(member.role || fallback.role || "member");
    const normalizedTeam = normalizeCode(member.teamCode || fallback.teamCode || "", DEFAULT_TEAM);
    const name = normalizeDisplayName(member.name || fallback.name || "");
    if (!name) {
      return;
    }

    const rawId = String(member.id || fallback.id || "").trim();
    const id = rawId || `presence-${normalizedRole}-${normalizedTeam}-${name.toLowerCase().replace(/\s+/g, "-")}`;

    if (Boolean(member.simulated || fallback.simulated)) {
      return;
    }

    const existing = membersById.get(id);
    membersById.set(id, {
      id,
      name,
      role: normalizeRole(member.role || fallback.role || existing?.role || normalizedRole || "member"),
      simulated: false,
      registeredMember: Boolean(member.registeredMember || fallback.registeredMember || existing?.registeredMember),
      online: Boolean(member.online || fallback.online || existing?.online)
    });
  };

  currentTeamMembers.forEach((member) => {
    upsertMember(member, {
      online: true,
      simulated: Boolean(member?.simulated),
      registeredMember: Boolean(member?.registeredMember)
    });
  });

  currentPresenceUsers.forEach((member) => {
    upsertMember(member, {
      online: true,
      simulated: Boolean(member?.simulated),
      registeredMember: Boolean(member?.registeredMember)
    });
  });

  if (globalPresenceUsers.length > 0) {
    globalPresenceUsers
      .filter((member) => {
        const role = normalizeRole(member?.role || "member");
        return role === "member" || role === "guest";
      })
      .forEach((member) => {
        upsertMember(member, {
          online: true,
          simulated: Boolean(member?.simulated),
          registeredMember: Boolean(member?.registeredMember),
          teamCode: member?.teamCode
        });
      });
  }

  const currentNormalizedRole = normalizeRole(currentRole);
  if (!isAdminPortal && !currentTeam && currentView.type === "dm"
    && (currentNormalizedRole === "guest" || currentNormalizedRole === "member")) {
    const selfAudienceId = String(socket?.id || "").trim()
      || `self-${currentNormalizedRole}-${normalizeDisplayName(currentUser).toLowerCase().replace(/\s+/g, "-")}`;
    upsertMember({
      id: selfAudienceId,
      name: currentUser,
      role: currentNormalizedRole,
      simulated: false,
      registeredMember: currentNormalizedRole === "member",
      online: true
    });
  }

  if (isAdminPortal) {
    dmConversations
      .filter((conversation) => isSupportConversation(conversation))
      .forEach((conversation) => {
        const requesterName = normalizeDisplayName(conversation?.peerName || "");
        if (!requesterName) {
          return;
        }

        const syntheticId = `support-guest-${requesterName.toLowerCase().replace(/\s+/g, "-")}`;
        if (Array.from(membersById.values()).some((entry) => normalizeDisplayName(entry.name) === requesterName)) {
          return;
        }

        upsertMember({
          id: syntheticId,
          name: requesterName,
          role: "guest",
          simulated: false,
          registeredMember: false,
          online: true
        });
      });
  }

  return Array.from(membersById.values())
    .sort((a, b) => a.name.localeCompare(b.name, "id"));
};

const updateAudienceSidebarVisibility = () => {
  if (!memberPresenceCard) {
    return;
  }

  const shouldHideMemberCard = !isAdminPortal && normalizeRole(currentRole) === "guest";
  memberPresenceCard.classList.toggle("hidden", shouldHideMemberCard);
};

const clearDemoBots = ({ silent = false } = {}) => {
  if (autoCrowdRotateTimerId) {
    window.clearInterval(autoCrowdRotateTimerId);
    autoCrowdRotateTimerId = null;
  }

  demoBots.forEach((bot) => {
    bot.timers.forEach((timer) => window.clearTimeout(timer));
    if (bot.socket && bot.socket.connected) {
      bot.socket.disconnect();
    }
    bot.socket = null;
    bot.online = false;
  });

  demoBots = [];
  demoModeEnabled = false;
  autoCrowdChannelCode = "";
  autoCrowdPausedByRealMembers = false;
  renderUsers(currentPresenceUsers);

  if (!silent) {
    notify("Mode keramaian otomatis dimatikan.", "info", { inlineDuration: 2600, toast: false });
  }
};

const getRealOnlineMemberCount = () => {
  return currentPresenceUsers
    .filter((member) => member && !member.simulated)
    .filter((member) => normalizeDisplayName(member.name || ""))
    .length;
};

const shouldPauseAutoCrowdForRealMembers = () => {
  return getRealOnlineMemberCount() >= AUTO_CROWD_REAL_MEMBER_PAUSE_THRESHOLD;
};

const clearAutoCrowdChatTimers = () => {
  demoBots.forEach((bot) => {
    bot.timers.forEach((timer) => window.clearTimeout(timer));
    bot.timers = [];
  });
};

const updateChannelFormAccess = () => {
  const allowed = Boolean(currentUser) && Boolean(currentTeam) && canCreateChannels(normalizeRole(currentRole));

  if (channelForm && channelInput) {
    channelForm.classList.toggle("hidden", !allowed);
    channelInput.disabled = !allowed || !hasJoinedServer;

    const submitButton = channelForm.querySelector("button[type='submit']");
    if (submitButton) {
      submitButton.disabled = !allowed || !hasJoinedServer;
    }

    if (!allowed) {
      channelInput.value = "";
    }
  }

  if (teamCreateForm && teamCreateInput) {
    teamCreateForm.classList.toggle("hidden", !allowed);
    teamCreateInput.disabled = !allowed || !hasJoinedServer;

    const submitButton = teamCreateForm.querySelector("button[type='submit']");
    if (submitButton) {
      submitButton.disabled = !allowed || !hasJoinedServer;
    }

    if (!allowed) {
      teamCreateInput.value = "";
    }
  }
};

const hashString = (value) => {
  const text = String(value || "");
  let hash = 0;

  for (let index = 0; index < text.length; index += 1) {
    hash = ((hash << 5) - hash) + text.charCodeAt(index);
    hash |= 0;
  }

  return hash;
};

const pickBySeed = (items, seed) => {
  if (!Array.isArray(items) || items.length === 0) {
    return "";
  }

  return items[Math.abs(hashString(seed)) % items.length];
};

const isAutoCrowdBotActive = (bot) => {
  if (!bot || !bot.socket?.connected || !bot.online) {
    return false;
  }

  const botId = String(bot.id || "").trim();
  const botName = normalizeDisplayName(bot.name || "");
  if (!botId && !botName) {
    return false;
  }

  const presence = currentPresenceUsers.find((member) => {
    if (!member || typeof member !== "object") {
      return false;
    }

    const presenceId = String(member.id || "").trim();
    const presenceName = normalizeDisplayName(member.name || "");
    return (botId && presenceId === botId)
      || (botName && presenceName === botName);
  });

  if (!presence) {
    return false;
  }

  const presenceRole = normalizeRole(presence.role || "member");
  const presenceOnline = presence.online !== false;
  return presenceRole === "guest"
    && Boolean(presence.simulated)
    && presenceOnline;
};

const scheduleAutoCrowdThread = (script, startDelay) => {
  const targetChannelCode = normalizeCode(autoCrowdChannelCode || currentChannel, DEFAULT_CHANNEL);

  script.forEach((turn, index) => {
    const bot = turn?.bot;
    const message = String(turn?.text || "").trim();
    if (!bot || !message) {
      return;
    }

    const typingStartDelay = startDelay + (index * AUTO_CROWD_THREAD_MESSAGE_GAP_MS);
    const sendDelay = typingStartDelay + AUTO_CROWD_TYPING_LEAD_MS;

    bot.timers.push(window.setTimeout(() => {
      if (!isAutoCrowdBotActive(bot)) {
        return;
      }

      bot.socket.emit("typing:start");
    }, typingStartDelay));

    bot.timers.push(window.setTimeout(() => {
      if (!isAutoCrowdBotActive(bot)) {
        return;
      }

      bot.socket.emit("typing:stop");
      bot.socket.emit("chat:message", {
        text: message,
        mode: "channel",
        channelCode: targetChannelCode
      });
    }, sendDelay));
  });
};

const queueAutoCrowdDiscussionWaves = (onlineBots, topicSeed) => {
  const waveCount = Math.max(3, Math.min(8, onlineBots.length));

  for (let index = 0; index < waveCount; index += 1) {
    const script = buildAutoCrowdThread(onlineBots, topicSeed + index);
    if (!script.length) {
      continue;
    }

    const startLag = AUTO_CROWD_WAVE_BASE_DELAY_MS
      + (index * AUTO_CROWD_WAVE_GAP_MS)
      + Math.floor(Math.random() * AUTO_CROWD_WAVE_RANDOM_DELAY_MS);
    scheduleAutoCrowdThread(script, startLag);
  }
};

const buildAutoCrowdThread = (onlineBots, topicIndex) => {
  const candidates = shuffleArray(onlineBots).filter((bot) => isAutoCrowdBotActive(bot));
  if (candidates.length < 3) {
    return [];
  }

  const speakers = candidates.slice(0, Math.min(4, candidates.length));
  const seed = `${speakers.map((bot) => bot.name).join("|")}:${topicIndex}`;
  const leadName = speakers[0].name;
  const buddyName = speakers[1].name;

  const starter = pickBySeed(AUTO_CROWD_THREAD_STARTERS, `${seed}:starter`).replaceAll("{name}", buddyName);
  const firstReply = pickBySeed(AUTO_CROWD_THREAD_RESPONSES, `${seed}:replyA`);
  const secondReply = pickBySeed(AUTO_CROWD_THREAD_FOLLOWUPS, `${seed}:replyB`);
  const thirdReply = pickBySeed(AUTO_CROWD_THREAD_RESPONSES, `${seed}:replyC`);
  const ending = pickBySeed(AUTO_CROWD_THREAD_ENDINGS, `${seed}:ending`);

  const turns = [
    { bot: speakers[0], text: starter },
    { bot: speakers[1], text: `${firstReply} Aku setuju arahnya dari ${leadName}.` },
    { bot: speakers[2], text: `${secondReply} Tadi aku cek lagi di mobile, hasilnya sudah lebih halus.` },
    { bot: speakers[1], text: `${thirdReply} Kalau perlu, kita tinggal rapihin detail kecilnya.` },
    { bot: speakers[0], text: ending }
  ];

  if (speakers[3]) {
    turns.splice(4, 0, {
      bot: speakers[3],
      text: `${pickBySeed(AUTO_CROWD_THREAD_FOLLOWUPS, `${seed}:replyD`)} Aku bantu pantau setelah ini.`
    });
  }

  return turns;
};

const setChatReadyState = (isReady) => {
  const ready = Boolean(isReady);
  hasJoinedServer = ready;

  messageInput.disabled = !ready;
  chatForm.querySelector("button[type='submit']").disabled = !ready;
  if (fileToggle) {
    fileToggle.disabled = !ready;
  }
  if (codeModeSelect) {
    codeModeSelect.disabled = !ready;
  }
  if (codeModeTrigger) {
    codeModeTrigger.disabled = !ready;
    if (!ready) {
      closeCodeModeDropdown();
    }
  }
  if (emojiToggle) {
    emojiToggle.disabled = !ready;
  }
  if (gifToggle) {
    gifToggle.disabled = !ready;
  }
  if (clearHistoryButton) {
    clearHistoryButton.disabled = !ready;
  }

  if (!ready) {
    messageInput.value = "";
    closeEmojiPicker();
    closeGifPicker();
  }

  updateClearHistoryButtonState();
  updateChannelFormAccess();
};

const buildAutoCrowdNames = (excludeName, targetCount) => {
  const names = [];
  const excludedKey = normalizeDisplayName(excludeName).toLowerCase();
  const pool = [];

  AUTO_CROWD_FIRST_NAMES.forEach((firstName) => {
    AUTO_CROWD_LAST_NAMES.forEach((lastName) => {
      pool.push(`${firstName} ${lastName}`);
    });
  });

  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
  }

  for (const candidate of pool) {
    const normalized = normalizeDisplayName(candidate).toLowerCase();
    if (!normalized || normalized === excludedKey || names.includes(candidate)) {
      continue;
    }

    names.push(candidate);
    if (names.length >= targetCount) {
      break;
    }
  }

  while (names.length < targetCount) {
    const suffix = String(names.length + 1).padStart(2, "0");
    const fallbackName = `Warga ${suffix}`;
    if (fallbackName.toLowerCase() !== excludedKey) {
      names.push(fallbackName);
    }
  }

  return names;
};

const ensureAutoCrowdUsers = () => {
  if (!hasJoinedServer || !currentUser) {
    return;
  }

  const targetChannelCode = normalizeCode(currentChannel, DEFAULT_CHANNEL);

  if (targetChannelCode === DEFAULT_CHANNEL) {
    if (demoModeEnabled) {
      clearDemoBots({ silent: true });
    }
    return;
  }

  if (!currentSimulationConfig.enabled) {
    if (demoModeEnabled) {
      clearDemoBots({ silent: true });
    }
    return;
  }

  if (!canUseDemoUsers(normalizeRole(currentRole))) {
    return;
  }

  if (demoModeEnabled) {
    if (autoCrowdChannelCode === targetChannelCode) {
      return;
    }

    // User switched channels; rebuild simulated sockets into the new channel.
    clearDemoBots({ silent: true });
  }

  clearDemoBots({ silent: true });

  const selectedNames = buildAutoCrowdNames(currentUser, AUTO_CROWD_USER_COUNT);
  demoBots = selectedNames.map((botName, index) => ({
    id: `sim-${index + 1}`,
    name: botName,
    socket: null,
    timers: [],
    online: false
  }));
  autoCrowdChannelCode = targetChannelCode;

  const rotateAutoCrowdMembers = () => {
    if (!demoModeEnabled || !demoBots.length) {
      return;
    }

    demoBots.forEach((bot) => {
      bot.timers.forEach((timer) => window.clearTimeout(timer));
      bot.timers = [];

      if (bot.socket) {
        try {
          bot.socket.disconnect();
        } catch {
          // Keep rotation resilient even if a socket fails to disconnect cleanly.
        }
      }

      bot.socket = null;
      bot.online = false;
    });

    const shuffledBots = shuffleArray(demoBots);
    const targetOnlineCount = getTargetAutoCrowdOnlineCount(shuffledBots.length);
    const onlineBots = shuffledBots.slice(0, targetOnlineCount);

    onlineBots.forEach((bot, index) => {
      bot.online = true;

      const botSocket = io({ forceNew: true, reconnection: false });
      bot.socket = botSocket;

      botSocket.on("connect", () => {
        botSocket.emit("join:request", {
          name: bot.name,
          teamCode: currentTeam,
          channelCode: autoCrowdChannelCode || targetChannelCode,
          role: "guest",
          simulated: true
        });
      });

      botSocket.on("connect_error", () => {
        // Ignore single bot failures to keep crowd simulation resilient.
      });
    });

    const queueDiscussionWhenReady = (attempt = 0) => {
      if (!demoModeEnabled) {
        return;
      }

      const readyBots = onlineBots.filter((bot) => isAutoCrowdBotActive(bot));
      if (readyBots.length < 3) {
        if (attempt < AUTO_CROWD_DISCUSSION_RETRY_MAX_ATTEMPTS) {
          const retryTimer = window.setTimeout(
            () => queueDiscussionWhenReady(attempt + 1),
            AUTO_CROWD_DISCUSSION_RETRY_MS
          );

          if (onlineBots[0]) {
            onlineBots[0].timers.push(retryTimer);
          }
        }

        return;
      }

      if (shouldPauseAutoCrowdForRealMembers()) {
        autoCrowdPausedByRealMembers = true;
        clearAutoCrowdChatTimers();
        return;
      }

      autoCrowdPausedByRealMembers = false;
      const topicSeed = Math.floor(Date.now() / 60000);
      queueAutoCrowdDiscussionWaves(readyBots, topicSeed);
    };

    const discussionWaveTimer = window.setTimeout(
      () => queueDiscussionWhenReady(0),
      AUTO_CROWD_DISCUSSION_START_DELAY_MS
    );

    if (onlineBots[0]) {
      onlineBots[0].timers.push(discussionWaveTimer);
    }

    renderUsers(currentPresenceUsers);
  };

  demoModeEnabled = true;
  rotateAutoCrowdMembers();
  autoCrowdRotateTimerId = window.setInterval(rotateAutoCrowdMembers, AUTO_CROWD_ROTATE_INTERVAL_MS);
};

const renderUsers = (users) => {
  userList.replaceChildren();
  privilegedList?.replaceChildren();
  guestList?.replaceChildren();

  currentPresenceUsers = Array.isArray(users) ? [...users] : [];
  const allMembers = buildMemberDirectory();
  const memberUsers = allMembers.filter((entry) => normalizeRole(entry?.role || "member") === "member");
  const privilegedUsers = allMembers.filter((entry) => isPrivilegedRole(normalizeRole(entry?.role || "member")));
  const guestUsers = allMembers.filter((entry) => normalizeRole(entry?.role || "member") === "guest");

  const buildAudienceWithQuota = (entries, role, targetTotal) => {
    const source = Array.isArray(entries) ? [...entries] : [];
    void role;
    void targetTotal;
    return source.filter((entry) => !entry?.simulated);
  };

  const getStableAudienceOnlineStatus = (entries, role, keepOnlineName = "") => {
    const audience = Array.isArray(entries)
      ? entries.map((entry) => ({ ...entry }))
      : [];
    const liveSimulatedStatusById = new Map(
      demoBots.map((bot) => [String(bot?.id || ""), Boolean(bot?.socket?.connected && bot?.online)])
    );
    const isPlaceholderSimulatedId = (id) => /^sim-(member|guest)-/i.test(String(id || ""));

    const state = simulationPresenceState[role] || simulationPresenceState.member;
    const now = Date.now();
    const shouldReset =
      state.onlineById.size === 0
      || now - state.lastResetAt >= SIMULATION_PRESENCE_RESET_INTERVAL_MS;

    if (shouldReset) {
      state.onlineById.clear();

      const placeholderSimulatedUsers = audience.filter(
        (entry) => entry?.simulated && isPlaceholderSimulatedId(entry?.id)
      );
      if (placeholderSimulatedUsers.length > 0) {
        const minOnline = Math.max(1, Math.floor(placeholderSimulatedUsers.length * 0.32));
        const maxOnline = Math.max(minOnline, Math.floor(placeholderSimulatedUsers.length * 0.72));
        const targetOnline = minOnline + Math.floor(Math.random() * (maxOnline - minOnline + 1));
        const shuffledSimulated = shuffleArray(placeholderSimulatedUsers);
        const onlineIds = new Set(
          shuffledSimulated.slice(0, targetOnline).map((entry) => String(entry.id || ""))
        );

        placeholderSimulatedUsers.forEach((entry) => {
          const id = String(entry.id || "");
          if (!id) {
            return;
          }

          state.onlineById.set(id, onlineIds.has(id));
        });
      }

      state.lastResetAt = now;
    }

    const safeKeepOnlineName = normalizeDisplayName(keepOnlineName || "");
    return audience.map((entry) => {
      if (!entry?.simulated) {
        const isKeepOnline = safeKeepOnlineName
          && normalizeDisplayName(entry?.name || "") === safeKeepOnlineName;
        return {
          ...entry,
          online: isKeepOnline ? true : Boolean(entry?.online)
        };
      }

      const id = String(entry.id || "");
      if (!id) {
        return {
          ...entry,
          online: false
        };
      }

      if (!isPlaceholderSimulatedId(id)) {
        return {
          ...entry,
          online: liveSimulatedStatusById.get(id) === true
        };
      }

      return {
        ...entry,
        online: state.onlineById.get(id) === true
      };
    });
  };

  const getStableAudienceDisplayOrder = (entries, role) => {
    const audience = Array.isArray(entries) ? [...entries] : [];
    const state = audienceOrderState[role] || audienceOrderState.member;

    audience.forEach((entry) => {
      const key = String(entry?.id || normalizeDisplayName(entry?.name || "")).trim().toLowerCase();
      if (!key || state.rankByKey.has(key)) {
        return;
      }

      state.rankByKey.set(key, state.nextRank);
      state.nextRank += 1;
    });

    return audience.sort((a, b) => {
      const keyA = String(a?.id || normalizeDisplayName(a?.name || "")).trim().toLowerCase();
      const keyB = String(b?.id || normalizeDisplayName(b?.name || "")).trim().toLowerCase();
      const rankA = state.rankByKey.get(keyA) ?? Number.MAX_SAFE_INTEGER;
      const rankB = state.rankByKey.get(keyB) ?? Number.MAX_SAFE_INTEGER;
      if (rankA !== rankB) {
        return rankA - rankB;
      }

      return normalizeDisplayName(a?.name || "").localeCompare(normalizeDisplayName(b?.name || ""), "id");
    });
  };

  const getPersistentAudienceRoster = (entries, role, targetTotal) => {
    const audience = Array.isArray(entries) ? [...entries] : [];
    const state = audienceOrderState[role] || audienceOrderState.member;
    const now = Date.now();
    const currentKeys = new Set();

    audience.forEach((entry) => {
      const key = String(entry?.id || normalizeDisplayName(entry?.name || "")).trim().toLowerCase();
      if (!key) {
        return;
      }

      currentKeys.add(key);
      if (!state.rankByKey.has(key)) {
        state.rankByKey.set(key, state.nextRank);
        state.nextRank += 1;
      }

      const existing = state.entryByKey.get(key) || {};
      state.entryByKey.set(key, {
        ...existing,
        ...entry,
        online: Boolean(entry.online),
        lastSeenAt: now
      });
    });

    state.entryByKey.forEach((entry, key) => {
      if (currentKeys.has(key)) {
        return;
      }

      state.entryByKey.delete(key);
    });

    const roster = Array.from(state.entryByKey.entries()).map(([key, entry]) => ({
      ...entry,
      __stableRank: state.rankByKey.get(key) ?? Number.MAX_SAFE_INTEGER
    }));

    roster.sort((a, b) => {
      if (a.__stableRank !== b.__stableRank) {
        return a.__stableRank - b.__stableRank;
      }

      return normalizeDisplayName(a?.name || "").localeCompare(normalizeDisplayName(b?.name || ""), "id");
    });

    return roster.slice(0, Math.max(0, Number(targetTotal) || 0));
  };

  const memberUsersWithQuota = buildAudienceWithQuota(
    memberUsers,
    "member",
    SIMULATION_MEMBER_TARGET_TOTAL
  );
  const privilegedUsersWithQuota = buildAudienceWithQuota(
    privilegedUsers,
    "privileged",
    SIMULATION_MEMBER_TARGET_TOTAL
  );
  const guestUsersWithQuota = buildAudienceWithQuota(
    guestUsers,
    "guest",
    SIMULATION_GUEST_TARGET_TOTAL
  );

  const preparedMemberUsers = currentSimulationConfig?.enabled
    ? getStableAudienceOnlineStatus(memberUsersWithQuota, "member", currentUser)
    : memberUsersWithQuota;
  const preparedPrivilegedUsers = currentSimulationConfig?.enabled
    ? getStableAudienceOnlineStatus(privilegedUsersWithQuota, "privileged")
    : privilegedUsersWithQuota;
  const preparedGuestUsers = currentSimulationConfig?.enabled
    ? getStableAudienceOnlineStatus(guestUsersWithQuota, "guest")
    : guestUsersWithQuota;

  const orderedMemberUsers = getStableAudienceDisplayOrder(preparedMemberUsers, "member");
  const orderedPrivilegedUsers = getStableAudienceDisplayOrder(preparedPrivilegedUsers, "privileged");
  const orderedGuestUsers = getStableAudienceDisplayOrder(preparedGuestUsers, "guest");
  const persistentMemberUsers = getPersistentAudienceRoster(orderedMemberUsers, "member", SIMULATION_MEMBER_TARGET_TOTAL);
  const persistentPrivilegedUsers = getPersistentAudienceRoster(orderedPrivilegedUsers, "privileged", SIMULATION_MEMBER_TARGET_TOTAL);
  const persistentGuestUsers = getPersistentAudienceRoster(orderedGuestUsers, "guest", SIMULATION_GUEST_TARGET_TOTAL);

  const memberStats = {
    total: persistentMemberUsers.length,
    online: persistentMemberUsers.filter((entry) => entry.online).length
  };
  memberStats.offline = Math.max(0, memberStats.total - memberStats.online);

  const guestStats = {
    total: persistentGuestUsers.length,
    online: persistentGuestUsers.filter((entry) => entry.online).length
  };
  guestStats.offline = Math.max(0, guestStats.total - guestStats.online);

  const privilegedStats = {
    total: persistentPrivilegedUsers.length,
    online: persistentPrivilegedUsers.filter((entry) => entry.online).length
  };
  privilegedStats.offline = Math.max(0, privilegedStats.total - privilegedStats.online);

  if (onlineCount) {
    onlineCount.textContent = String(memberStats.total);
  }
  if (memberTotalCount) {
    memberTotalCount.textContent = String(memberStats.total);
  }
  if (memberOnlineCount) {
    memberOnlineCount.textContent = String(memberStats.online);
  }
  if (memberOfflineCount) {
    memberOfflineCount.textContent = String(memberStats.offline);
  }
  if (privilegedTotalCount) {
    privilegedTotalCount.textContent = String(privilegedStats.total);
  }
  if (privilegedOnlineCount) {
    privilegedOnlineCount.textContent = String(privilegedStats.online);
  }
  if (privilegedOfflineCount) {
    privilegedOfflineCount.textContent = String(privilegedStats.offline);
  }
  if (guestTotalCount) {
    guestTotalCount.textContent = String(guestStats.total);
  }
  if (guestOnlineCount) {
    guestOnlineCount.textContent = String(guestStats.online);
  }
  if (guestOfflineCount) {
    guestOfflineCount.textContent = String(guestStats.offline);
  }

  const derivedOnlineTotal = memberStats.online + privilegedStats.online + guestStats.online;
  const nextOnlineTotal = hasReceivedGlobalStatsFromServer
    ? Math.max(derivedOnlineTotal, currentGlobalStats.onlineUsers)
    : derivedOnlineTotal;
  const nextVisitorTotal = hasReceivedGlobalStatsFromServer
    ? Math.max(memberStats.total + privilegedStats.total + guestStats.total, currentGlobalStats.totalVisitors)
    : (memberStats.total + privilegedStats.total + guestStats.total);
  const nextMemberOnline = hasReceivedGlobalStatsFromServer
    ? Math.max(memberStats.online, currentGlobalStats.memberOnline)
    : memberStats.online;
  const nextGuestOnline = hasReceivedGlobalStatsFromServer
    ? Math.max(guestStats.online, currentGlobalStats.guestOnline)
    : guestStats.online;

  updateAudienceSidebarVisibility();

  updateAdminRealtimeStats({
    onlineUsers: nextOnlineTotal,
    totalVisitors: nextVisitorTotal,
    memberOnline: nextMemberOnline,
    guestOnline: nextGuestOnline,
    updatedAt: new Date().toISOString(),
    source: hasReceivedGlobalStatsFromServer
      ? "sinkronisasi server + presence"
      : "perhitungan presence team aktif"
  });

  const query = String(memberSearchInput?.value || "").trim().toLowerCase();
  const filteredMemberUsers = query
    ? persistentMemberUsers.filter((entry) => normalizeDisplayName(entry?.name || "").toLowerCase().includes(query))
    : persistentMemberUsers;

  const appendUserCard = (targetList, user, { enableRoleActions = false } = {}) => {
    if (!targetList) {
      return;
    }

    const formattedName = normalizeDisplayName(user.name);
    const role = normalizeRole(user.role || "member");
    const item = document.createElement("li");
    item.className = "member-profile";

    const card = document.createElement("article");
    card.className = "member-card";

    const avatar = document.createElement("span");
    avatar.className = "member-avatar";
    applyDefaultAvatar(avatar, formattedName, role);

    const info = document.createElement("div");
    info.className = "member-content";

    const nameEl = document.createElement("p");
    nameEl.className = "member-name";
    nameEl.textContent = formattedName;

    const isSimulatedMember = Boolean(user.simulated);
    const isOnline = Boolean(user.online);
    const isRegisteredMember = Boolean(user.registeredMember) && !isSimulatedMember;
    if (isSimulatedMember) {
      const crowdBadge = document.createElement("span");
      if (role === "guest") {
        crowdBadge.className = "guest-simulasi-badge";
        crowdBadge.textContent = "";
        crowdBadge.setAttribute("aria-label", "Guest simulasi");
      } else {
        crowdBadge.className = "member-crowd-badge";
        crowdBadge.textContent = "★";
        crowdBadge.setAttribute("aria-label", "Member simulasi");
      }
      nameEl.appendChild(crowdBadge);
    }

    if (isRegisteredMember) {
      const realBadge = document.createElement("span");
      realBadge.className = "member-real-badge";
      realBadge.textContent = "★";
      realBadge.setAttribute("aria-label", "Member terdaftar");
      nameEl.appendChild(realBadge);
    }

    const meta = document.createElement("p");
    meta.className = "member-meta";

    const statusBadge = document.createElement("span");
    statusBadge.className = `member-status-badge ${isOnline ? "online" : "offline"}`;
    statusBadge.textContent = isOnline ? "Online" : "Offline";

    const isCurrentUser = formattedName === currentUser;
    const roleLabel = getRoleLabel(role);
    const profileLabel = role === "guest" ? "Profil guest" : "Profil member";
    const baseText = isCurrentUser
      ? `${roleLabel} • Kamu`
      : `${roleLabel} • ${profileLabel}`;

    meta.textContent = `${baseText} • `;
    meta.appendChild(statusBadge);

    info.appendChild(nameEl);
    info.appendChild(meta);

    const actionWrap = document.createElement("div");
    actionWrap.className = "member-action";

    if (isCurrentUser) {
      const youTag = document.createElement("span");
      youTag.className = "member-you";
      youTag.textContent = "You";
      actionWrap.appendChild(youTag);
    } else if (isOnline) {
      const dmButton = document.createElement("button");
      dmButton.type = "button";
      dmButton.className = "member-chat-btn member-item";
      dmButton.textContent = "Chat";
      dmButton.addEventListener("click", () => {
        socket.emit("dm:start", { targetUserId: user.id });
      });
      actionWrap.appendChild(dmButton);

      if (enableRoleActions && canManageRoles(normalizeRole(currentRole)) && role !== "owner") {
        const roleActions = [
          { nextRole: "admin", label: "Admin" },
          { nextRole: "operator", label: "Operator" },
          { nextRole: "member", label: "Member" }
        ];

        const roleDropdown = document.createElement("div");
        roleDropdown.className = "member-role-dropdown";

        const roleButton = document.createElement("button");
        roleButton.type = "button";
        roleButton.className = "member-role-btn";
        roleButton.textContent = "Role";
        roleButton.setAttribute("aria-expanded", "false");

        const roleMenu = document.createElement("div");
        roleMenu.className = "member-role-menu hidden";

        roleActions.forEach((action) => {
          const actionBtn = document.createElement("button");
          actionBtn.type = "button";
          actionBtn.className = "member-role-action";
          actionBtn.textContent = action.label;

          actionBtn.addEventListener("click", () => {
            socket.emit("role:update", {
              targetUserId: user.id,
              nextRole: action.nextRole
            });
            roleMenu.classList.add("hidden");
            roleButton.setAttribute("aria-expanded", "false");
          });

          roleMenu.appendChild(actionBtn);
        });

        roleButton.addEventListener("click", (event) => {
          event.stopPropagation();
          const willOpen = roleMenu.classList.contains("hidden");
          roleMenu.classList.toggle("hidden", !willOpen);
          roleButton.setAttribute("aria-expanded", willOpen ? "true" : "false");
        });

        document.addEventListener("click", (event) => {
          if (!roleDropdown.contains(event.target)) {
            roleMenu.classList.add("hidden");
            roleButton.setAttribute("aria-expanded", "false");
          }
        });

        roleDropdown.appendChild(roleButton);
        roleDropdown.appendChild(roleMenu);
        actionWrap.appendChild(roleDropdown);
      }
    }

    card.appendChild(avatar);
    card.appendChild(info);
    card.appendChild(actionWrap);
    item.appendChild(card);
    targetList.appendChild(item);
  };

  if (filteredMemberUsers.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "member-empty";
    emptyItem.textContent = query
      ? "Tidak ada member yang cocok dengan pencarian."
      : "Belum ada member pada team ini.";
    userList.appendChild(emptyItem);
  } else {
    filteredMemberUsers.forEach((user) => {
      appendUserCard(userList, user, { enableRoleActions: true });
    });
  }

  if (privilegedList) {
    if (persistentPrivilegedUsers.length === 0) {
      const emptyPrivileged = document.createElement("li");
      emptyPrivileged.className = "member-empty";
      emptyPrivileged.textContent = "Belum ada user privileged pada team ini.";
      privilegedList.appendChild(emptyPrivileged);
    } else {
      persistentPrivilegedUsers.forEach((user) => {
        appendUserCard(privilegedList, user, { enableRoleActions: true });
      });
    }
  }

  if (!guestList) {
    return;
  }

  if (persistentGuestUsers.length === 0) {
    const emptyGuest = document.createElement("li");
    emptyGuest.className = "member-empty";
    emptyGuest.textContent = "Belum ada guest pada team ini.";
    guestList.appendChild(emptyGuest);
    return;
  }

  persistentGuestUsers.forEach((user) => {
    appendUserCard(guestList, user, { enableRoleActions: false });
  });
};

const closeEmojiPicker = () => {
  if (!emojiPicker || !emojiToggle) {
    return;
  }

  emojiPicker.classList.add("hidden");
  emojiToggle.classList.remove("active");
};

const closeGifPicker = () => {
  if (!gifPicker || !gifToggle) {
    return;
  }

  gifPicker.classList.add("hidden");
  gifToggle.classList.remove("active");
};

const insertEmojiAtCursor = (emoji) => {
  const input = messageInput;
  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? input.value.length;
  const value = input.value;

  input.value = `${value.slice(0, start)}${emoji}${value.slice(end)}`;
  const nextPos = start + emoji.length;
  input.setSelectionRange(nextPos, nextPos);
  input.focus();
  startTyping();
};

const setupEmojiPicker = () => {
  if (!emojiPicker || !emojiToggle) {
    return;
  }

  emojiPicker.replaceChildren();
  emojiPicker.classList.remove("fallback");
  emojiPicker.classList.add("rich");

  const mountRichPicker = () => {
    const picker = document.createElement("emoji-picker");
    picker.setAttribute("locale", "id");
    picker.setAttribute("theme", "dark");
    picker.addEventListener("emoji-click", (event) => {
      const emoji = event?.detail?.unicode;
      if (!emoji) {
        return;
      }

      insertEmojiAtCursor(emoji);
      closeEmojiPicker();
    });

    emojiPicker.replaceChildren();
    emojiPicker.classList.remove("fallback");
    emojiPicker.classList.add("rich");
    emojiPicker.appendChild(picker);
  };

  if (customElements.get("emoji-picker")) {
    mountRichPicker();
  } else {
    emojiPicker.classList.remove("rich");
    emojiPicker.classList.add("fallback");
    QUICK_EMOJIS.forEach((emoji) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "emoji-item";
      button.textContent = emoji;
      button.setAttribute("aria-label", `emoji ${emoji}`);
      button.addEventListener("click", () => {
        insertEmojiAtCursor(emoji);
      });
      emojiPicker.appendChild(button);
    });

    customElements.whenDefined("emoji-picker").then(() => {
      if (!emojiPicker.querySelector("emoji-picker")) {
        mountRichPicker();
      }
    }).catch(() => {
      // Keep fallback emoji list when rich picker script is unavailable.
    });
  }

  emojiToggle.addEventListener("click", () => {
    const opening = emojiPicker.classList.contains("hidden");
    if (opening) {
      closeGifPicker();
      emojiPicker.classList.remove("hidden");
      emojiToggle.classList.add("active");
      messageInput.focus();
      return;
    }

    closeEmojiPicker();
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    if (emojiPicker.contains(target) || emojiToggle.contains(target)) {
      return;
    }

    closeEmojiPicker();
  });
};

const renderGifResults = (items) => {
  if (!gifResultGrid) {
    return;
  }

  gifResultGrid.replaceChildren();

  if (!items.length) {
    const empty = document.createElement("p");
    empty.className = "gif-empty";
    empty.textContent = "GIF tidak ditemukan.";
    gifResultGrid.appendChild(empty);
    return;
  }

  items.forEach((item) => {
    const previewUrl = String(
      item?.previewUrl
      || item?.url
      || item?.media_formats?.tinygif?.url
      || item?.media_formats?.gif?.url
      || item?.media?.[0]?.tinygif?.url
      || item?.media?.[0]?.gif?.url
      || ""
    ).trim();
    const fullUrl = String(
      item?.url
      || item?.media_formats?.gif?.url
      || item?.media?.[0]?.gif?.url
      || previewUrl
    ).trim();
    if (!previewUrl || !fullUrl) {
      return;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = "gif-item";

    const title = String(item?.content_description || item?.title || "GIF").slice(0, 80) || "GIF";
    const image = document.createElement("img");
    image.src = previewUrl;
    image.alt = title;
    image.loading = "lazy";
    button.appendChild(image);

    button.addEventListener("click", () => {
      emitChatMessage({
        text: "",
        attachment: {
          name: `${title}.gif`,
          url: fullUrl,
          mimeType: "image/gif",
          size: 1,
          kind: "image"
        }
      });

      closeGifPicker();
      notify("GIF terkirim.", "success", { inline: false, toastDuration: 2400 });
    });

    gifResultGrid.appendChild(button);
  });
};

const fetchTenorGifs = async (query) => {
  if (!gifResultGrid) {
    return;
  }

  const safeQuery = String(query || "").trim();
  if (!safeQuery) {
    return;
  }

  gifResultGrid.replaceChildren();
  const loading = document.createElement("p");
  loading.className = "gif-empty";
  loading.textContent = "Mencari GIF...";
  gifResultGrid.appendChild(loading);

  try {
    const url = new URL("https://g.tenor.com/v1/search");
    url.searchParams.set("key", TENOR_API_KEY);
    url.searchParams.set("q", safeQuery);
    url.searchParams.set("limit", "18");
    url.searchParams.set("media_filter", "minimal");
    url.searchParams.set("contentfilter", "medium");
    url.searchParams.set("client_key", TENOR_CLIENT_KEY);

    const response = await fetch(url.toString());
    const payload = await response.json();
    if (!response.ok) {
      const errorMessage = typeof payload?.error === "string"
        ? payload.error
        : payload?.error?.message || payload?.message || "Gagal ambil GIF.";
      throw new Error(errorMessage);
    }

    renderGifResults(Array.isArray(payload?.results) ? payload.results : []);
  } catch (error) {
    const lowered = safeQuery.toLowerCase();
    const fallbackItems = CURATED_GIFS.filter((item) => {
      const title = item.title.toLowerCase();
      const tags = item.tags.join(" ").toLowerCase();
      return title.includes(lowered) || tags.includes(lowered);
    });

    if (fallbackItems.length > 0) {
      renderGifResults(fallbackItems);
      return;
    }

    gifResultGrid.replaceChildren();
    const failed = document.createElement("p");
    failed.className = "gif-empty";
    failed.textContent = error?.message || "Koneksi GIF gagal.";
    gifResultGrid.appendChild(failed);
  }
};

const setupGifPicker = () => {
  if (!gifToggle || !gifPicker || !gifSearchForm || !gifSearchInput || !gifSearchButton || !gifResultGrid) {
    return;
  }

  gifToggle.addEventListener("click", () => {
    const opening = gifPicker.classList.contains("hidden");
    if (opening) {
      closeEmojiPicker();
      gifPicker.classList.remove("hidden");
      gifToggle.classList.add("active");
      gifSearchInput.focus();

      if (!gifResultGrid.childElementCount) {
        const initialQuery = lastGifQuery || "happy";
        gifSearchInput.value = initialQuery;
        fetchTenorGifs(initialQuery);
      }
      return;
    }

    closeGifPicker();
  });

  const runGifSearch = () => {
    const query = String(gifSearchInput.value || "").trim();
    if (!query) {
      return;
    }

    lastGifQuery = query;
    fetchTenorGifs(query);
  };

  gifSearchButton.addEventListener("click", runGifSearch);
  gifSearchInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    runGifSearch();
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    if (gifPicker.contains(target) || gifToggle.contains(target)) {
      return;
    }

    closeGifPicker();
  });
};

const startTyping = () => {
  if (!isTyping) {
    isTyping = true;
    socket.emit("typing:start");
  }

  if (typingTimer) {
    clearTimeout(typingTimer);
  }

  typingTimer = setTimeout(() => {
    isTyping = false;
    socket.emit("typing:stop");
  }, 900);
};

const stopTyping = () => {
  if (!isTyping) {
    return;
  }

  isTyping = false;
  socket.emit("typing:stop");
  clearTimeout(typingTimer);
};

const isMessageForCurrentView = (message) => {
  const context = message?.context;
  if (!context) {
    return true;
  }

  if (currentView.type === "dm") {
    return context.type === "dm" && context.dmKey === currentView.dmKey;
  }

  return context.type === "channel" && context.channelCode === currentChannel;
};

const switchToDmView = (payload) => {
  hideBroadcastNotice();
  const supportScope = String(payload?.supportScope || "").trim().toLowerCase();
  currentView = {
    type: "dm",
    channelCode: currentChannel,
    dmKey: payload.dmKey,
    peerName: normalizeDisplayName(payload.peerName),
    supportScope
  };

  addDmConversation(payload.dmKey, payload.peerName, { supportScope });
  markDmConversationSupportScope(payload.dmKey, supportScope);
  clearDmConversationUnread(payload.dmKey);
  renderDmList();
  renderUsers(currentPresenceUsers);
  setHeader();

  messageCache.clear();
  messageList.replaceChildren();
  (payload.history || []).forEach((message) => {
    if (message?.context?.type === "dm") {
      touchDmConversationMeta({
        dmKey: message.context.dmKey,
        text: message.text,
        timestamp: message.timestamp,
        increaseUnread: false
      });
      markDmConversationBroadcast(message.context.dmKey, Boolean(message?.context?.isBroadcast));
      markDmConversationSupportScope(message.context.dmKey, message?.context?.supportScope);
    }
    pushMessage(message);
  });
  typingIndicator.textContent = "";
  throttleNotice.textContent = "";
  renderPinnedNotice();
};

const switchToChannelView = () => {
  hideBroadcastNotice();
  currentView = {
    type: "channel",
    channelCode: currentChannel,
    dmKey: "",
    peerName: "",
    supportScope: ""
  };

  messageCache.clear();
  messageList.replaceChildren();

  requestChannelSwitch(currentChannel);
  renderDmList();
  setHeader();
  renderPinnedNotice();
};

const handleJoin = () => {
  const name = nameInput.value.trim();
  if (!name) {
    nameInput.focus();
    return;
  }

  const selectedRole = normalizeRole(joinRoleSelect?.value || "member");
  if (isAdminPortal && !isPrivilegedRole(selectedRole)) {
    notify("Portal admin hanya untuk role owner/admin/operator.", "warning", { inlineDuration: 3200 });
    joinRoleSelect.value = getDefaultJoinRoleValue();
    joinRoleSelect.dispatchEvent(new Event("change"));
    return;
  }

  const password = String(joinPasswordInput?.value || "").trim();
  const wantsDirectAdminOnJoin = String(joinDirectAdminInput?.value || "admins") === "admins";

  if ((selectedRole === "member" || isPrivilegedRole(selectedRole)) && !password) {
    notify(
      selectedRole === "member"
        ? "Password wajib diisi untuk login sebagai Member. Guest saja yang bisa masuk langsung."
        : "Password wajib diisi untuk role owner/admin.",
      "warning",
      { inlineDuration: 3200 }
    );
    joinPasswordInput?.focus();
    return;
  }

  currentUser = normalizeDisplayName(name.slice(0, 24));
  currentTeam = getSelectedJoinTeamCode();
  currentChannel = getSelectedJoinChannelCode();
  currentRole = selectedRole;
  currentAccessPassword = password;
  const privateJoinMode = (selectedRole === "guest" || selectedRole === "member") && !currentTeam && !currentChannel;
  pendingDirectAdminAutoStartOnJoin = wantsDirectAdminOnJoin
    && !isAdminPortal
    && currentDirectAdminConfig.enabled
    && (selectedRole === "guest" || selectedRole === "member")
    && privateJoinMode;
  currentView = {
    type: privateJoinMode ? "dm" : "channel",
    channelCode: currentChannel,
    dmKey: "",
    peerName: privateJoinMode ? "Customer Service" : "",
    supportScope: privateJoinMode ? "admins" : ""
  };

  syncDmHistoryClearCutoffProfile();
  syncHiddenDmRoutesProfile();

  setHeader();
  renderDmList();

  pendingPortalJoinAttempt = true;
  saveMemberLogin();
  emitJoinRequest();

  setChatReadyState(false);

  joinModal.classList.add("hidden");
  joinModal.hidden = true;
};

const handleJoinTrigger = (event) => {
  event.preventDefault();
  handleJoin();
};

joinForm.addEventListener("submit", (event) => {
  event.preventDefault();
  handleJoin();
});

if (joinRoleSelect && joinPasswordInput) {
  applyLoginConfigToJoinForm(currentLoginConfig);
  applyJoinRoleOptions();

  const updateJoinPasswordField = () => {
    const selectedRole = normalizeRole(joinRoleSelect.value);
    const needsPassword = selectedRole === "member" || isPrivilegedRole(selectedRole);
    const canShowJoinDirectAdminOption = !isAdminPortal
      && currentDirectAdminConfig.enabled
      && (selectedRole === "guest" || selectedRole === "member");
    joinPasswordInput.required = needsPassword;
    joinPasswordInput.placeholder = selectedRole === "member"
      ? "Password member"
      : "Password";

    if (joinPasswordField) {
      joinPasswordField.hidden = !needsPassword;
    }

    if (!needsPassword) {
      joinPasswordInput.value = "";
    }

    if (joinDirectAdminField) {
      joinDirectAdminField.classList.toggle("hidden", !canShowJoinDirectAdminOption);
    }

    if (joinDirectAdminInput) {
      joinDirectAdminInput.value = "admins";
    }
  };

  joinRoleSelect.addEventListener("change", updateJoinPasswordField);
  joinRoleSelect.dispatchEvent(new Event("change"));
}

fetchLoginConfig();
fetchUploadConfig();
fetchDirectAdminConfig();

if (teamInput) {
  teamInput.addEventListener("change", () => {
    if (realMembersModal && !realMembersModal.classList.contains("hidden") && realMemberTeamPreview) {
      realMemberTeamPreview.value = getJoinTeamCodeForMembersDirectory();
    }
  });
}

if (realMembersButton) {
  realMembersButton.addEventListener("click", () => {
    openRealMembersModal();
  });
}

if (realMembersCloseButton) {
  realMembersCloseButton.addEventListener("click", () => {
    closeRealMembersModal();
  });
}

if (realMembersForm) {
  realMembersForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      await registerNewRealMember();
    } catch (error) {
      if (realMembersMeta) {
        realMembersMeta.textContent = error?.message || "Pendaftaran member baru gagal.";
      }
    }
  });
}

if (joinRoleDropdown && joinRoleTrigger && joinRoleMenu && joinRoleSelect) {
  syncJoinRoleDropdownState();

  joinRoleTrigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const willOpen = joinRoleMenu.classList.contains("hidden");
    joinRoleDropdown.classList.toggle("open", willOpen);
    if (willOpen) {
      positionJoinRoleDropdownMenu();
    } else {
      joinRoleMenu.classList.add("hidden");
    }
    joinRoleTrigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
  });

  joinRoleMenu.addEventListener("click", (event) => {
    const target = event.target.closest("[data-join-role]");
    if (!target) {
      return;
    }

    const nextRole = String(target.getAttribute("data-join-role") || "").trim().toLowerCase();
    if (!nextRole) {
      return;
    }

    joinRoleSelect.value = nextRole;
    joinRoleSelect.dispatchEvent(new Event("change"));
    syncJoinRoleDropdownState();
    closeJoinRoleDropdown();
  });

  joinRoleSelect.addEventListener("change", syncJoinRoleDropdownState);

  document.addEventListener("click", (event) => {
    if (!joinRoleDropdown.contains(event.target)) {
      closeJoinRoleDropdown();
    }
  });

  window.addEventListener("resize", () => {
    if (joinRoleDropdown.classList.contains("open")) {
      positionJoinRoleDropdownMenu();
    }
  });
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!hasJoinedServer) {
    notify("Tunggu sebentar, proses masuk team masih berjalan...", "info", { inlineDuration: 2400, toast: false });
    return;
  }

  const text = applyComposerCodeMode(messageInput.value.trim());
  if (!text) {
    return;
  }

  emitChatMessage({ text });

  messageInput.value = "";
  stopTyping();
});

if (isLiveChatEmbed) {
  liveChatAutoJoin();
}

if (fileToggle && fileInput) {
  fileToggle.addEventListener("click", () => {
    if (!hasJoinedServer) {
      notify("Join team dulu sebelum kirim file.", "warning", { inlineDuration: 2600 });
      return;
    }

    fileInput.click();
  });

  fileInput.addEventListener("change", async () => {
    const selected = fileInput.files?.[0];
    if (!selected) {
      return;
    }

    if (!hasJoinedServer) {
      notify("Join team dulu sebelum kirim file.", "warning", { inlineDuration: 2600 });
      fileInput.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", selected);

    fileToggle.disabled = true;
    notify(`Mengunggah ${selected.name}...`, "info", { inlineDuration: 1800, toast: false });

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      const result = await response.json();
      if (!response.ok || !result?.ok || !result?.file) {
        throw new Error(result?.message || "Upload gagal");
      }

      emitChatMessage({
        text: applyComposerCodeMode(messageInput.value.trim()),
        attachment: result.file
      });

      messageInput.value = "";
      clearStatusNotice();
      notify(`${selected.name} berhasil diunggah.`, "success", { inline: false, toastDuration: 2600 });
      stopTyping();
    } catch (error) {
      notify(error?.message || "Upload file gagal.", "error", { inlineDuration: 3400 });
    } finally {
      fileToggle.disabled = !hasJoinedServer;
      fileInput.value = "";
    }
  });
}

channelForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!canCreateChannels(normalizeRole(currentRole))) {
    notify("Hanya owner/admin/operator yang bisa membuat channel.", "warning", { inlineDuration: 2800 });
    return;
  }

  const nextChannel = normalizeCode(channelInput.value, "");
  if (!nextChannel) {
    return;
  }

  socket.emit("channel:create", { channelCode: nextChannel });
  requestChannelSwitch(nextChannel);
  channelInput.value = "";
});

if (teamCreateForm) {
  teamCreateForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!canCreateChannels(normalizeRole(currentRole))) {
      notify("Hanya owner/admin/operator yang bisa membuat team.", "warning", { inlineDuration: 2800 });
      return;
    }

    const nextTeam = normalizeCode(teamCreateInput?.value, "");
    if (!nextTeam) {
      return;
    }

    socket.emit("team:create", { teamCode: nextTeam });
    teamCreateInput.value = "";
  });
}

if (codeModeSelect) {
  codeModeSelect.addEventListener("change", onCodeModeSelectChange);
}

if (codeModeDropdown && codeModeTrigger && codeModeMenu && codeModeSelect) {
  codeModeTrigger.addEventListener("click", () => {
    if (codeModeTrigger.disabled) {
      return;
    }

    const willOpen = !codeModeDropdown.classList.contains("open");
    codeModeDropdown.classList.toggle("open", willOpen);
    if (willOpen) {
      positionCodeModeDropdownMenu();
    } else {
      closeCodeModeDropdown();
    }
    codeModeTrigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
  });

  codeModeMenu.addEventListener("click", (event) => {
    const target = event.target.closest("[data-code-mode]");
    if (!target) {
      return;
    }

    const nextLanguage = String(target.getAttribute("data-code-mode") || "").trim().toLowerCase();
    codeModeSelect.value = ["off", "html", "css", "js"].includes(nextLanguage) ? nextLanguage : "off";
    onCodeModeSelectChange();
    closeCodeModeDropdown();
  });

  document.addEventListener("click", (event) => {
    if (!codeModeDropdown.contains(event.target)) {
      closeCodeModeDropdown();
    }
  });

  window.addEventListener("resize", () => {
    syncMobileViewportHeight();

    if (!isMobileSidebarViewport()) {
      closeMobileSidebar();
    }

    if (codeModeDropdown.classList.contains("open")) {
      positionCodeModeDropdownMenu();
    }

    if (document.activeElement === messageInput) {
      scrollMessageListToLatest();
    }

    updateSidebarScrollIndicators();
    updateLiveChatRouteScrollIndicators();
  });

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", () => {
      syncMobileViewportHeight();
      scheduleComposerAdjustment();

      if (document.activeElement === messageInput) {
        scrollMessageListToLatest();
      }
    });

    window.visualViewport.addEventListener("scroll", () => {
      if (document.activeElement === messageInput) {
        scheduleComposerAdjustment();
      }
    });
  }
}

if (mobileSidebarToggle) {
  mobileSidebarToggle.addEventListener("click", () => {
    toggleMobileSidebar();
  });
}

if (mobileSidebarBackdrop) {
  mobileSidebarBackdrop.addEventListener("click", () => {
    closeMobileSidebar();
  });
}

if (sidebarCloseButton) {
  sidebarCloseButton.addEventListener("click", () => {
    closeMobileSidebar();
  });
}

if (sidebarPanel) {
  sidebarPanel.addEventListener("scroll", () => {
    updateSidebarScrollIndicators();
  }, { passive: true });

  sidebarPanel.addEventListener("touchstart", (event) => {
    if (!isMobileSidebarViewport() || !document.body.classList.contains("sidebar-open")) {
      resetSidebarSwipeTracking();
      return;
    }

    const touch = event.touches?.[0];
    if (!touch) {
      resetSidebarSwipeTracking();
      return;
    }

    sidebarTouchStartX = touch.clientX;
    sidebarTouchStartY = touch.clientY;
    sidebarTouchLastX = touch.clientX;
    sidebarTouchLastY = touch.clientY;
    sidebarSwipeTracking = true;
  }, { passive: true });

  sidebarPanel.addEventListener("touchmove", (event) => {
    if (!sidebarSwipeTracking) {
      return;
    }

    const touch = event.touches?.[0];
    if (!touch) {
      return;
    }

    sidebarTouchLastX = touch.clientX;
    sidebarTouchLastY = touch.clientY;
  }, { passive: true });

  sidebarPanel.addEventListener("touchend", () => {
    if (!sidebarSwipeTracking) {
      return;
    }

    const deltaX = sidebarTouchLastX - sidebarTouchStartX;
    const deltaY = sidebarTouchLastY - sidebarTouchStartY;
    const strongLeftSwipe = deltaX < -52 && Math.abs(deltaX) > Math.abs(deltaY) * 1.15;
    if (strongLeftSwipe) {
      closeMobileSidebar();
    }

    resetSidebarSwipeTracking();
  }, { passive: true });

  sidebarPanel.addEventListener("touchcancel", () => {
    resetSidebarSwipeTracking();
  }, { passive: true });

  requestAnimationFrame(() => {
    updateSidebarScrollIndicators();
  });
}

if (channelList) {
  channelList.addEventListener("click", () => {
    closeMobileSidebar();
  });
}

if (dmList) {
  dmList.addEventListener("click", () => {
    closeMobileSidebar();
  });
}

if (liveChatRouteList) {
  liveChatRouteList.addEventListener("click", () => {
    closeMobileSidebar();
  });

  liveChatRouteList.addEventListener("scroll", () => {
    updateLiveChatRouteScrollIndicators();
  }, { passive: true });

  requestAnimationFrame(() => {
    updateLiveChatRouteScrollIndicators();
  });
}

bindDmFilterControls(liveChatFilterControls);
bindDmFilterControls(dmFilterControls);
syncDmFilterControls();
syncBulkDeleteScopeSelection();

if (userList) {
  userList.addEventListener("click", () => {
    closeMobileSidebar();
  });
}

if (memberSearchInput) {
  memberSearchInput.addEventListener("input", () => {
    renderUsers(currentPresenceUsers);
  });
}

if (backToChannelButton) {
  backToChannelButton.addEventListener("click", switchToChannelView);
}

if (clearHistoryButton) {
  clearHistoryButton.addEventListener("click", () => {
    if (!hasJoinedServer) {
      notify("Silakan join dulu sebelum hapus history chat.", "warning", { inlineDuration: 2600 });
      return;
    }

    if (currentView.type === "dm") {
      const dmKey = String(currentView.dmKey || "").trim();
      if (!dmKey) {
        notify("DM belum siap untuk dihapus history-nya.", "warning", { inlineDuration: 2600 });
        return;
      }

      const peerLabel = normalizeDisplayName(currentView.peerName || "Customer Service");
      const agreed = window.confirm(`Hapus semua history DM dengan ${peerLabel}?`);
      if (!agreed) {
        return;
      }

      socket.emit("chat:history:clear", {
        mode: "dm",
        dmKey,
        peerName: currentView.peerName,
        supportScope: String(currentView.supportScope || "") || undefined
      });
      return;
    }

    if (normalizeRole(currentRole) !== "admin") {
      notify("Hanya admin yang bisa hapus history channel.", "warning", { inlineDuration: 2800 });
      return;
    }

    const channelLabel = normalizeCode(currentChannel, DEFAULT_CHANNEL);
    const agreed = window.confirm(`Hapus semua history channel #${channelLabel}?`);
    if (!agreed) {
      return;
    }

    socket.emit("chat:history:clear", {
      mode: "channel",
      channelCode: channelLabel
    });
  });
}

if (logoutButton) {
  logoutButton.addEventListener("click", logoutCurrentSession);
}

if (accountSettingsToggle && accountSettingsForm) {
  setAdminSectionExpanded(accountSettingsToggle, accountSettingsForm, false);
  accountSettingsToggle.addEventListener("click", () => {
    const isExpanded = accountSettingsToggle.getAttribute("aria-expanded") === "true";
    setAdminSectionExpanded(accountSettingsToggle, accountSettingsForm, !isExpanded);
  });
}

if (broadcastMessageToggle && broadcastMessageForm) {
  setAdminSectionExpanded(broadcastMessageToggle, broadcastMessageForm, false);
  broadcastMessageToggle.addEventListener("click", () => {
    const isExpanded = broadcastMessageToggle.getAttribute("aria-expanded") === "true";
    setAdminSectionExpanded(broadcastMessageToggle, broadcastMessageForm, !isExpanded);
  });
}

if (broadcastTeamChecklistTrigger && broadcastTeamChecklistMenu) {
  broadcastTeamChecklistTrigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const willOpen = broadcastTeamChecklistMenu.classList.contains("hidden");
    closeBroadcastChecklistMenus();
    broadcastTeamChecklistMenu.classList.toggle("hidden", !willOpen);
    broadcastTeamChecklistTrigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
  });
}

if (broadcastChannelChecklistTrigger && broadcastChannelChecklistMenu) {
  broadcastChannelChecklistTrigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const willOpen = broadcastChannelChecklistMenu.classList.contains("hidden");
    closeBroadcastChecklistMenus();
    broadcastChannelChecklistMenu.classList.toggle("hidden", !willOpen);
    broadcastChannelChecklistTrigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
  });
}

if (broadcastRoleChecklistTrigger && broadcastRoleChecklistMenu) {
  broadcastRoleChecklistTrigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const willOpen = broadcastRoleChecklistMenu.classList.contains("hidden");
    closeBroadcastChecklistMenus();
    broadcastRoleChecklistMenu.classList.toggle("hidden", !willOpen);
    broadcastRoleChecklistTrigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
  });
}

if (bulkDeleteScopeTrigger && bulkDeleteScopeMenu) {
  bulkDeleteScopeTrigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const willOpen = bulkDeleteScopeMenu.classList.contains("hidden");
    closeBulkDeleteChecklistMenu();
    closeBroadcastChecklistMenus();
    closeJoinChecklistMenus();

    if (willOpen) {
      bulkDeleteScopeMenu.classList.remove("hidden");
      bulkDeleteScopeTrigger.setAttribute("aria-expanded", "true");
      return;
    }

    closeBulkDeleteChecklistMenu();
  });
}

if (bulkDeleteActionButton) {
  bulkDeleteActionButton.addEventListener("click", (event) => {
    event.stopPropagation();
    emitBulkDeleteSelectedConversations();
  });
}

if (bulkDeleteLiveChatToggle) {
  bulkDeleteLiveChatToggle.addEventListener("change", () => {
    syncBulkDeleteScopeSelection();
  });
}

if (bulkDeleteDmToggle) {
  bulkDeleteDmToggle.addEventListener("change", () => {
    syncBulkDeleteScopeSelection();
  });
}

if (joinTeamChecklistTrigger && joinTeamChecklistMenu) {
  joinTeamChecklistTrigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const willOpen = joinTeamChecklistMenu.classList.contains("hidden");
    closeJoinChecklistMenus();
    joinTeamChecklistMenu.classList.toggle("hidden", !willOpen);
    joinTeamChecklistTrigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
  });
}

if (joinChannelChecklistTrigger && joinChannelChecklistMenu) {
  joinChannelChecklistTrigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const willOpen = joinChannelChecklistMenu.classList.contains("hidden");
    closeJoinChecklistMenus();
    joinChannelChecklistMenu.classList.toggle("hidden", !willOpen);
    joinChannelChecklistTrigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
  });
}

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) {
    closeBulkDeleteChecklistMenu();
    closeBroadcastChecklistMenus();
    closeJoinChecklistMenus();
    return;
  }

  const insideChecklist = target.closest(".broadcast-checklist");
  const insideBulkDeleteChecklist = target.closest("#bulkDeleteChecklist");
  if (!insideBulkDeleteChecklist) {
    closeBulkDeleteChecklistMenu();
  }

  if (!insideChecklist) {
    closeBroadcastChecklistMenus();
    closeJoinChecklistMenus();
  }
});

if (loginConfigToggle && loginConfigForm) {
  setAdminSectionExpanded(loginConfigToggle, loginConfigForm, false);
  loginConfigToggle.addEventListener("click", () => {
    const isExpanded = loginConfigToggle.getAttribute("aria-expanded") === "true";
    setAdminSectionExpanded(loginConfigToggle, loginConfigForm, !isExpanded);
  });
}

if (uploadConfigToggle && uploadConfigForm) {
  setAdminSectionExpanded(uploadConfigToggle, uploadConfigForm, false);
  uploadConfigToggle.addEventListener("click", () => {
    const isExpanded = uploadConfigToggle.getAttribute("aria-expanded") === "true";
    setAdminSectionExpanded(uploadConfigToggle, uploadConfigForm, !isExpanded);
  });
}

if (directAdminConfigToggle && directAdminConfigForm) {
  setAdminSectionExpanded(directAdminConfigToggle, directAdminConfigForm, false);
  directAdminConfigToggle.addEventListener("click", () => {
    const isExpanded = directAdminConfigToggle.getAttribute("aria-expanded") === "true";
    setAdminSectionExpanded(directAdminConfigToggle, directAdminConfigForm, !isExpanded);
  });
}

if (messageList) {
  messageList.addEventListener("touchstart", () => {
    messageListUserInteracting = true;
  }, { passive: true });

  messageList.addEventListener("touchend", () => {
    messageListUserInteracting = false;
    scrollMessageListToLatest();
  }, { passive: true });

  messageList.addEventListener("touchcancel", () => {
    messageListUserInteracting = false;
    scrollMessageListToLatest();
  }, { passive: true });

  messageList.addEventListener("scroll", () => {
    updateMessageListScrollIndicators();
  }, { passive: true });

  requestAnimationFrame(() => {
    updateMessageListScrollIndicators();
  });
}

messageInput.addEventListener("input", () => {
  clearStatusNotice();
  startTyping();
  if (isMessageListNearBottom()) {
    scrollMessageListToLatest();
  }
});

messageInput.addEventListener("focus", () => {
  clearStatusNotice();
  scheduleComposerAdjustment();
  if (isMessageListNearBottom()) {
    scrollMessageListToLatest();
  }
});

messageInput.addEventListener("click", () => {
  scheduleComposerAdjustment();
});

messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
});

socket.on("connect", () => {
  setConnectionState(true);
  setChatReadyState(false);

  socket.emit("stats:global:request");

  if (currentUser) {
    emitJoinRequest();
  }
});

socket.on("disconnect", () => {
  setConnectionState(false);
  setChatReadyState(false);
  clearDemoBots({ silent: true });
});

socket.on("join:error", (payload) => {
  if (pendingTeamSwitchCode && pendingTeamSwitchView) {
    currentView = {
      type: pendingTeamSwitchView.type,
      channelCode: pendingTeamSwitchView.channelCode,
      dmKey: pendingTeamSwitchView.dmKey,
      peerName: pendingTeamSwitchView.peerName,
      supportScope: String(pendingTeamSwitchView.supportScope || "")
    };
    setHeader();
    renderDmList();
    renderPinnedNotice();
    setChatReadyState(true);
  }

  pendingTeamSwitchCode = "";
  pendingTeamSwitchView = null;
  pendingChannelSwitchCode = "";
  pendingDirectAdminAutoStartOnJoin = false;
  const errorMessage = payload?.message || "Gagal join team/channel.";
  if (broadcastSendInFlight || /broadcast/i.test(String(errorMessage))) {
    clearBroadcastSendPendingState();
    setBroadcastSendSummary("Broadcast gagal terkirim.", "error", errorMessage);
  }

  if (!hasJoinedServer) {
    joinModal.classList.remove("hidden");
    joinModal.hidden = false;
    pendingPortalJoinAttempt = false;
  } else if (pendingPortalJoinAttempt) {
    joinModal.classList.remove("hidden");
    joinModal.hidden = false;
    pendingPortalJoinAttempt = false;
  }

  setChatReadyState(hasJoinedServer);
  renderChannels(currentTeamChannels);
  notify(errorMessage, "error", { inlineDuration: 3800 });
});

socket.on("channel:joined", (payload) => {
  pendingPortalJoinAttempt = false;
  pendingTeamSwitchCode = "";
  pendingTeamSwitchView = null;
  pendingChannelSwitchCode = "";
  currentTeam = normalizeCode(payload?.teamCode, DEFAULT_TEAM);
  currentChannel = normalizeCode(payload?.channelCode, DEFAULT_CHANNEL);
  currentRole = normalizeRole(payload?.role || currentRole);
  currentUserIsRegisteredMember = Boolean(payload?.registeredMember);

  currentView = {
    type: "channel",
    channelCode: currentChannel,
    dmKey: "",
    peerName: "",
    supportScope: ""
  };

  currentPinnedMessage = null;

  syncDmHistoryClearCutoffProfile();
  syncHiddenDmRoutesProfile();

  setHeader();
  renderDmList();

  if (teamInput) {
    teamInput.value = currentTeam;
  }

  if (joinChannelInput) {
    joinChannelInput.value = currentChannel;
  }

  joinModal.classList.add("hidden");
  joinModal.hidden = true;
  saveMemberLogin();
  socket.emit("stats:global:request");

  setChatReadyState(true);
  const shouldAutoStartDirectAdmin = pendingDirectAdminAutoStartOnJoin
    && !isAdminPortal
    && (normalizeRole(currentRole) === "guest" || normalizeRole(currentRole) === "member");
  pendingDirectAdminAutoStartOnJoin = false;
  if (shouldAutoStartDirectAdmin) {
    window.setTimeout(() => {
      socket.emit("dm:direct-admin:start");
    }, 120);
  }
  ensureAutoCrowdUsers();
  focusMessageInputWithoutScroll();
});

socket.on("dm:ready", (payload) => {
  setChatReadyState(true);
  switchToDmView(payload);

  const dmKey = String(payload?.dmKey || "").trim();
  const peerName = normalizeDisplayName(payload?.peerName || "");
  const historyList = Array.isArray(payload?.history) ? payload.history : [];

  if (historyList.length === 0) {
    const conversationMeta = dmConversationMeta.get(dmKey);
    const cachedDmMessage = pendingDetachedDmMessages.get(dmKey)
      || pendingDetachedDmMessagesByPeer.get(peerName)
      || buildDmPreviewFallbackMessage({
        dmKey,
        peerName,
        meta: conversationMeta
      });
    if (cachedDmMessage?.id && !getCachedMessageById(cachedDmMessage.id)) {
      pushMessage(cachedDmMessage);
    }
  }

  if (dmKey) {
    pendingDetachedDmMessages.delete(dmKey);
  }
  if (peerName) {
    pendingDetachedDmMessagesByPeer.delete(peerName);
  }

  if (!pendingAutoOpenBroadcastDm || pendingAutoOpenBroadcastDm.dmKey !== dmKey) {
    focusMessageInputWithoutScroll();
    return;
  }

  const pendingMessage = pendingAutoOpenBroadcastDm.message;
  pendingAutoOpenBroadcastDm = null;
  if (!pendingMessage?.id || getCachedMessageById(pendingMessage.id)) {
    focusMessageInputWithoutScroll();
    return;
  }

  pushMessage(pendingMessage);
  focusMessageInputWithoutScroll();
});

socket.on("channel:pinned", (payload) => {
  const channelCode = normalizeCode(payload?.channelCode, DEFAULT_CHANNEL);
  if (channelCode !== currentChannel || currentView.type !== "channel") {
    return;
  }

  const pinned = payload?.pinnedMessage;
  if (!pinned || !String(pinned.text || "").trim()) {
    currentPinnedMessage = null;
    renderPinnedNotice();
    return;
  }

  currentPinnedMessage = {
    sourceMessageId: String(pinned.sourceMessageId || "").trim(),
    text: String(pinned.text || "").trim(),
    user: normalizeDisplayName(pinned.user || "Unknown"),
    role: normalizeRole(pinned.role || "member"),
    pinnedBy: normalizeDisplayName(pinned.pinnedBy || "Unknown"),
    pinnedAt: String(pinned.pinnedAt || "").trim()
  };
  renderPinnedNotice();
});

socket.on("chat:history", (history) => {
  messageCache.clear();
  messageList.replaceChildren();
  history.forEach((message) => {
    pushMessage(message, { forceScroll: true });
  });
});

socket.on("dm:available", (payload) => {
  const dmKey = String(payload?.dmKey || "").trim();
  const supportScope = String(payload?.supportScope || "").trim().toLowerCase();
  const previewText = String(payload?.previewText || "").trim();
  const previewTimestamp = String(payload?.timestamp || "").trim();
  const hasUnread = Boolean(payload?.hasUnread);
  const isCurrentDmView = currentView.type === "dm" && currentView.dmKey === dmKey;
  const clearCutoffMs = Number(dmHistoryClearCutoffByKey.get(dmKey) || 0);
  const previewTimestampMs = Date.parse(previewTimestamp);
  const hasValidPreviewTime = Number.isFinite(previewTimestampMs);
  const isStalePreviewAfterClear = Boolean(previewText)
    && clearCutoffMs > 0
    && hasValidPreviewTime
    && previewTimestampMs <= clearCutoffMs;
  const effectivePreviewText = isStalePreviewAfterClear ? "" : previewText;
  const effectiveHasUnread = isStalePreviewAfterClear ? false : hasUnread;
  const shouldKeepHiddenRoute = hiddenDmRoutesByKey.has(dmKey)
    && !effectivePreviewText
    && !effectiveHasUnread;

  if (shouldKeepHiddenRoute) {
    suppressedEmptyDmKeys.add(dmKey);
    return;
  }

  if (suppressedEmptyDmKeys.has(dmKey) && !effectivePreviewText && !effectiveHasUnread) {
    return;
  }

  if (effectivePreviewText || effectiveHasUnread) {
    if (hiddenDmRoutesByKey.delete(dmKey)) {
      persistHiddenDmRoutesProfile();
    }
    suppressedEmptyDmKeys.delete(dmKey);
  }

  addDmConversation(dmKey, payload?.peerName, { supportScope });
  markDmConversationSupportScope(dmKey, supportScope);

  if (effectivePreviewText) {
    touchDmConversationMeta({
      dmKey,
      text: effectivePreviewText,
      timestamp: previewTimestamp || new Date().toISOString(),
      increaseUnread: false
    });
  }

  if (isCurrentDmView) {
    clearDmConversationUnread(dmKey);
  } else if (effectiveHasUnread) {
    ensureDmConversationUnread(dmKey, 1);
  }

  renderDmList();
});

socket.on("team:state", (payload) => {
  currentTeam = normalizeCode(payload?.teamCode, currentTeam || DEFAULT_TEAM);
  currentTeamNotice = normalizeTeamNotice(payload?.noticeMessage, currentTeamNotice || DEFAULT_TEAM_NOTICE);
  currentTeamMembers = Array.isArray(payload?.members) ? payload.members : [];
  setKnownTeamChannels(currentTeam, payload?.channels || [DEFAULT_CHANNEL]);

  if (Array.isArray(payload?.availableTeams)) {
    setKnownTeamCodes(payload.availableTeams.map((teamEntry) => teamEntry?.teamCode));
    payload.availableTeams.forEach((teamEntry) => {
      setKnownTeamChannels(teamEntry?.teamCode, Array.isArray(teamEntry?.channels) ? teamEntry.channels : currentLoginConfig.channelOptions);
      updateBroadcastTeamTargetState({
        teamCode: teamEntry?.teamCode,
        channels: Array.isArray(teamEntry?.channels) ? teamEntry.channels : currentLoginConfig.channelOptions,
        activeChannels: teamEntry?.teamCode === currentTeam ? [currentChannel] : []
      });
    });
  }

  currentAuthState = {
    hasOwner: Boolean(payload?.auth?.hasOwner),
    ownerName: normalizeDisplayName(payload?.auth?.ownerName || ""),
    adminNames: Array.isArray(payload?.auth?.adminNames)
      ? payload.auth.adminNames.map((name) => normalizeDisplayName(name)).filter(Boolean)
      : [],
    operatorNames: Array.isArray(payload?.auth?.operatorNames)
      ? payload.auth.operatorNames.map((name) => normalizeDisplayName(name)).filter(Boolean)
      : []
  };

  const selfMemberById = currentTeamMembers.find(
    (member) => String(member?.id || "") === String(socket?.id || "")
  );
  const selfMemberByName = !selfMemberById
    ? currentTeamMembers.filter((member) => normalizeDisplayName(member.name) === currentUser)
    : [];

  let selfMember = selfMemberById || null;
  if (!selfMember && selfMemberByName.length === 1) {
    selfMember = selfMemberByName[0];
  }
  if (!selfMember && selfMemberByName.length > 1 && isPrivilegedRole(normalizeRole(currentRole))) {
    selfMember = selfMemberByName.find((member) => normalizeRole(member?.role || "") === normalizeRole(currentRole)) || null;
  }

  if (selfMember?.role) {
    const nextRole = normalizeRole(selfMember.role);
    if (!(isPrivilegedRole(normalizeRole(currentRole)) && !isPrivilegedRole(nextRole) && !selfMemberById)) {
      currentRole = nextRole;
    }
  }
  if (selfMember) {
    currentUserIsRegisteredMember = Boolean(selfMember.registeredMember);
  }

  if (payload?.loginConfig) {
    applyLoginConfigToJoinForm(payload.loginConfig);
  }

  if (payload?.directAdminConfig) {
    applyDirectAdminConfig(payload.directAdminConfig);
  }

  setHeader();
  renderChannels(payload?.channels || [DEFAULT_CHANNEL]);
  renderAdminPanel();
});

socket.on("stats:global", (payload) => {
  hasReceivedGlobalStatsFromServer = true;
  updateAdminRealtimeStats({
    onlineUsers: payload?.onlineUsers,
    totalVisitors: payload?.totalVisitors,
    memberOnline: payload?.memberOnline,
    guestOnline: payload?.guestOnline,
    updatedAt: payload?.updatedAt,
    source: "sinkronisasi server"
  });
});

socket.on("presence:global", (payload) => {
  globalPresenceUsers = Array.isArray(payload?.users)
    ? payload.users
    : [];
  renderUsers(currentPresenceUsers);
});

socket.on("login:config:updated", (payload) => {
  applyLoginConfigToJoinForm(payload?.config || null);
  notify("Pengaturan login member diperbarui.", "success", { inlineDuration: 2600 });
});

socket.on("upload:config:updated", (payload) => {
  applyUploadConfig(payload?.config || null);
  notify("Batas upload diperbarui.", "success", { inlineDuration: 2600 });
});

socket.on("direct-admin:config:updated", (payload) => {
  applyDirectAdminConfig(payload?.config || null);
  notify("Pengaturan chat langsung ke admin diperbarui.", "success", { inlineDuration: 2600 });
});

socket.on("team:created", (payload) => {
  const createdTeamCode = normalizeCode(payload?.teamCode, "");
  if (!createdTeamCode) {
    return;
  }

  setKnownTeamCodes([...(knownTeamCodes || []), createdTeamCode]);
  setKnownTeamChannels(createdTeamCode, [DEFAULT_CHANNEL]);
  renderTeams();

  updateBroadcastTeamTargetState({
    teamCode: createdTeamCode,
    channels: currentLoginConfig.channelOptions,
    activeChannels: []
  });
  renderAdminPanel();

  notify(`Team ${createdTeamCode} berhasil dibuat.`, "success", { inlineDuration: 3200 });
  fetchLoginConfig();
});

socket.on("chat:message", (message) => {
  const isGuestUser = normalizeRole(currentRole) === "guest";
  const isBroadcastDmMessage = message?.context?.type === "dm" && Boolean(message?.context?.isBroadcast);
  if (isGuestUser && isBroadcastDmMessage) {
    const senderName = normalizeDisplayName(message?.user || "Admin");
    const alreadyInSenderDm = currentView.type === "dm"
      && normalizeDisplayName(currentView.peerName) === senderName;

    if (!alreadyInSenderDm && senderName) {
      pendingAutoOpenBroadcastDm = {
        dmKey: String(message?.context?.dmKey || "").trim(),
        message
      };
      addDmConversation(message?.context?.dmKey, senderName, {
        supportScope: message?.context?.supportScope
      });
      renderDmList();
      socket.emit("dm:open", {
        peerName: senderName,
        dmKey: String(message?.context?.dmKey || "").trim() || undefined,
        supportScope: String(message?.context?.supportScope || "") || undefined
      });
    }
  }

  if (message?.context?.type === "dm") {
    const senderName = normalizeDisplayName(message?.user || "Unknown");
    const dmKey = String(message?.context?.dmKey || "").trim();
    if (dmKey) {
      const removedCutoff = dmHistoryClearCutoffByKey.delete(dmKey);
      if (removedCutoff) {
        persistDmHistoryClearCutoffProfile();
      }

      const removedHiddenRoute = hiddenDmRoutesByKey.delete(dmKey);
      if (removedHiddenRoute) {
        persistHiddenDmRoutesProfile();
      }
    }
    suppressedEmptyDmKeys.delete(dmKey);
    const dmPeerName = message.user === currentUser ? message?.context?.peerName : senderName;
    const supportScope = String(message?.context?.supportScope || "").trim().toLowerCase();
    const isCurrentDmView = currentView.type === "dm" && currentView.dmKey === dmKey;
    const isIncomingDm = senderName !== currentUser;

    addDmConversation(dmKey, dmPeerName, { supportScope });
    touchDmConversationMeta({
      dmKey,
      text: String(message?.text || "").trim() || "Pesan masuk",
      timestamp: message?.timestamp,
      increaseUnread: isIncomingDm && !isCurrentDmView
    });
    markDmConversationBroadcast(dmKey, Boolean(message?.context?.isBroadcast));
    markDmConversationSupportScope(dmKey, supportScope);
    if (isCurrentDmView) {
      clearDmConversationUnread(dmKey);
      pendingDetachedDmMessages.delete(dmKey);
      pendingDetachedDmMessagesByPeer.delete(normalizeDisplayName(dmPeerName));
    } else if (dmKey) {
      pendingDetachedDmMessages.set(dmKey, message);
      pendingDetachedDmMessagesByPeer.set(normalizeDisplayName(dmPeerName), message);
    }
    renderDmList();
  }

  maybeNotifyIncomingMessage(message);

  if (isMessageForCurrentView(message)) {
    pushMessage(message);
    return;
  }

  if (message?.context?.type === "dm") {
    return;
  }
});

socket.on("chat:history:cleared", (payload) => {
  const context = payload?.context;
  if (!context) {
    return;
  }

  const clearedBy = normalizeDisplayName(payload?.clearedBy || "User");
  const clearedAt = String(payload?.clearedAt || new Date().toISOString()).trim();
  const clearedAtMs = Date.parse(clearedAt);

  if (context.type === "dm") {
    const dmKey = String(context.dmKey || "").trim();
    if (!dmKey) {
      return;
    }

    const clearMode = String(payload?.clearMode || "").trim().toLowerCase();
    const isGlobalClear = clearMode === "global";

    if (isGlobalClear) {
      if (Number.isFinite(clearedAtMs)) {
        dmHistoryClearCutoffByKey.set(dmKey, clearedAtMs);
        persistDmHistoryClearCutoffProfile();
      }
      hiddenDmRoutesByKey.add(dmKey);
      persistHiddenDmRoutesProfile();
      suppressedEmptyDmKeys.add(dmKey);
      removeDmConversation(dmKey);

      if (currentView.type === "dm" && currentView.dmKey === dmKey) {
        messageCache.clear();
        messageList.replaceChildren();
        renderTyping([]);
        switchToChannelView();
      }

      renderDmList();
      notify(`History DM dihapus total oleh ${clearedBy}.`, "warning", { inlineDuration: 2600 });
      return;
    }

    if (Number.isFinite(clearedAtMs)) {
      dmHistoryClearCutoffByKey.set(dmKey, clearedAtMs);
      persistDmHistoryClearCutoffProfile();
    }

    if (hiddenDmRoutesByKey.delete(dmKey)) {
      persistHiddenDmRoutesProfile();
    }

    clearDmConversationUnread(dmKey);
    touchDmConversationMeta({
      dmKey,
      text: "Belum ada pesan",
      timestamp: clearedAt,
      increaseUnread: false
    });

    pendingDetachedDmMessages.delete(dmKey);
    const peerAlias = normalizeDisplayName(context.peerName || "");
    if (peerAlias) {
      pendingDetachedDmMessagesByPeer.delete(peerAlias);
    }

    if (currentView.type === "dm" && currentView.dmKey === dmKey) {
      messageCache.clear();
      messageList.replaceChildren();
      renderTyping([]);
    }

    renderDmList();
    notify(`History DM dihapus oleh ${clearedBy}.`, "warning", { inlineDuration: 2600 });
    return;
  }

  if (context.type !== "channel") {
    return;
  }

  const channelCode = normalizeCode(context.channelCode, DEFAULT_CHANNEL);
  if (currentView.type === "channel" && channelCode === currentChannel) {
    messageCache.clear();
    messageList.replaceChildren();
    renderTyping([]);
    currentPinnedMessage = null;
    renderPinnedNotice();
  }

  notify(`History channel #${channelCode} dihapus oleh ${clearedBy}.`, "warning", { inlineDuration: 2600 });
});

socket.on("chat:edited", (patch) => {
  const context = patch?.context;
  if (!context) {
    return;
  }

  const matchCurrentView = currentView.type === "dm"
    ? context.type === "dm" && context.dmKey === currentView.dmKey
    : context.type === "channel" && context.channelCode === currentChannel;

  if (!matchCurrentView) {
    return;
  }

  patchMessageInView(patch);
});

socket.on("system:message", (message) => {
  if (isMessageForCurrentView(message)) {
    pushMessage(message);
  }
});

socket.on("chat:throttled", (payload) => {
  notify(payload?.message || "Terlalu cepat kirim pesan.", "warning", { inlineDuration: 2800, toast: false });
});

socket.on("presence:update", (payload) => {
  onlineCount.textContent = String(payload?.onlineCount || 0);
  renderUsers(payload?.users || []);
  renderTyping(payload?.typingUsers || []);

  if (demoModeEnabled) {
    const shouldPause = shouldPauseAutoCrowdForRealMembers();
    if (shouldPause && !autoCrowdPausedByRealMembers) {
      autoCrowdPausedByRealMembers = true;
      clearAutoCrowdChatTimers();
    } else if (!shouldPause && autoCrowdPausedByRealMembers) {
      autoCrowdPausedByRealMembers = false;
      const readyBots = demoBots.filter((bot) => isAutoCrowdBotActive(bot));
      if (readyBots.length) {
        queueAutoCrowdDiscussionWaves(readyBots, Math.floor(Date.now() / 60000));
      }
    }
  }

  if (payload?.teamCode) {
    currentTeam = normalizeCode(payload.teamCode, currentTeam);
  }

  if (payload?.channelCode) {
    currentChannel = normalizeCode(payload.channelCode, currentChannel);

    if (currentView.type === "channel") {
      currentView.channelCode = currentChannel;
    }
  }

  const presenceUsers = Array.isArray(payload?.users) ? payload.users : [];
  const selfPresenceById = presenceUsers.find(
    (member) => String(member?.id || "") === String(socket?.id || "")
  );
  const selfPresenceByName = !selfPresenceById
    ? presenceUsers.filter((member) => normalizeDisplayName(member?.name || "") === currentUser)
    : [];

  let selfPresence = selfPresenceById || null;
  if (!selfPresence && selfPresenceByName.length === 1) {
    selfPresence = selfPresenceByName[0];
  }

  if (!selfPresence && selfPresenceByName.length > 1 && isPrivilegedRole(normalizeRole(currentRole))) {
    selfPresence = selfPresenceByName.find((member) => normalizeRole(member?.role || "") === normalizeRole(currentRole)) || null;
  }

  if (selfPresence) {
    const nextUserName = normalizeDisplayName(selfPresence.name || currentUser);
    let nextUserRole = normalizeRole(selfPresence.role || currentRole);
    if (!selfPresenceById && isPrivilegedRole(normalizeRole(currentRole)) && !isPrivilegedRole(nextUserRole)) {
      nextUserRole = normalizeRole(currentRole);
    }
    const profileChanged = nextUserName !== currentUser || nextUserRole !== currentRole;

    currentUser = nextUserName;
    currentRole = nextUserRole;
    currentUserIsRegisteredMember = Boolean(selfPresence.registeredMember);
    syncDmHistoryClearCutoffProfile();
    syncHiddenDmRoutesProfile();

    if (profileChanged && demoModeEnabled && hasJoinedServer) {
      clearDemoBots({ silent: true });
      ensureAutoCrowdUsers();
      renderUsers(payload?.users || currentPresenceUsers);
    }
  }

  setHeader();
});

if (previewCloseButton) {
  previewCloseButton.addEventListener("click", closeCodePreview);
}

if (previewModal) {
  previewModal.addEventListener("click", (event) => {
    if (event.target === previewModal) {
      closeCodePreview();
    }
  });
}

if (realMembersModal) {
  realMembersModal.addEventListener("click", (event) => {
    if (event.target === realMembersModal) {
      closeRealMembersModal();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileSidebar();
    closeCodeModeDropdown();
    closeEmojiPicker();
    closeGifPicker();
  }

  if (event.key === "Escape" && previewModal && !previewModal.classList.contains("hidden")) {
    closeCodePreview();
  }

  if (event.key === "Escape" && editModal && !editModal.classList.contains("hidden")) {
    closeEditModal();
  }

  if (event.key === "Escape" && realMembersModal && !realMembersModal.classList.contains("hidden")) {
    closeRealMembersModal();
  }
});

if (editCloseButton) {
  editCloseButton.addEventListener("click", closeEditModal);
}

if (editCancelButton) {
  editCancelButton.addEventListener("click", closeEditModal);
}

if (editModal) {
  editModal.addEventListener("click", (event) => {
    if (event.target === editModal) {
      closeEditModal();
    }
  });
}

if (editForm) {
  editForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const messageId = String(activeEditMessageId || "").trim();
    if (!messageId) {
      return;
    }

    const latestMessage = getCachedMessageById(messageId);
    if (!latestMessage) {
      closeEditModal();
      return;
    }

    const originalText = String(latestMessage.text || "").trim();
    const nextText = String(editMessageInput?.value || "").trim();
    if (!nextText) {
      notify("Pesan tidak boleh kosong.", "warning", { inlineDuration: 2800 });
      return;
    }

    if (nextText === originalText) {
      closeEditModal();
      return;
    }

    socket.emit("chat:edit", buildEditPayload(latestMessage, nextText));
    closeEditModal();
  });
}

setConnectionState(false);
configurePortalCopy();
mountMobileSidebarToggleToBody();
syncMobileViewportHeight();
setHeader();
renderTeamNotice();
renderDmList();
setChatReadyState(false);
updateCodeModeSelectUI();
syncMobileSidebarToggleState(false);
resetSidebarScrollPosition();

window.addEventListener("pageshow", keepSidebarAtTopBriefly);
window.addEventListener("load", keepSidebarAtTopBriefly, { once: true });
window.setTimeout(keepSidebarAtTopBriefly, 150);

const hasRestoredMemberLogin = restoreSavedMemberLogin();
if (hasRestoredMemberLogin) {
  joinModal.classList.add("hidden");
  joinModal.hidden = true;
  setHeader();
  renderDmList();
  notify(
    isAdminPortal ? "Menyambungkan ulang sesi admin..." : "Menyambungkan ulang sesi member...",
    "info",
    { inlineDuration: 2600, toast: false }
  );
  if (socket.connected) {
    emitJoinRequest();
  }
} else if (isRegistrationPortal) {
  if (joinModal) {
    joinModal.classList.add("hidden");
    joinModal.hidden = true;
  }
  openRealMembersModal();
} else {
  joinModal.hidden = false;
  nameInput.focus();
}

window.addEventListener("beforeunload", () => {
  clearDemoBots({ silent: true });
});

setupEmojiPicker();
setupGifPicker();

if (accountSettingsForm) {
  accountSettingsForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = String(settingsUsernameInput?.value || "").trim();
    const password = String(settingsPasswordInput?.value || "").trim();
    if (!username && !password) {
      notify("Isi username atau password baru dulu.", "warning", { inlineDuration: 2800 });
      return;
    }

    pendingSettingsPassword = password;
    socket.emit("auth:update-self", { username, password });
  });
}

if (broadcastMessageForm) {
  broadcastMessageForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!canManageRoles(normalizeRole(currentRole))) {
      notify("Hanya owner/admin yang bisa kirim broadcast.", "warning", { inlineDuration: 2800 });
      return;
    }

    const messageText = String(broadcastMessageInput?.value || "").trim().slice(0, 500);
    if (!messageText) {
      notify("Isi pesan broadcast dulu.", "warning", { inlineDuration: 2800 });
      return;
    }

    const targetTeamCodes = Array.from(selectedBroadcastTeamCodes)
      .map((teamCode) => normalizeCode(teamCode, ""))
      .filter(Boolean);
    const targetChannelCodes = Array.from(selectedBroadcastChannelCodes)
      .map((channelCode) => normalizeCode(channelCode, ""))
      .filter(Boolean);
    const targetRoles = Array.from(selectedBroadcastRecipientRoles)
      .map((role) => String(role || "").trim().toLowerCase())
      .filter((role) => role === "member" || role === "guest");

    if (targetTeamCodes.length === 0 && targetChannelCodes.length === 0 && targetRoles.length === 0) {
      notify("Checklist target dulu (Team / Channel / Member / Guest).", "warning", { inlineDuration: 2800 });
      return;
    }

    const durationSeconds = Math.max(
      5,
      Math.min(180, Number.parseInt(String(broadcastDurationInput?.value || "18"), 10) || 18)
    );

    socket.emit("broadcast:send", {
      targetMode: "members",
      targetTeamCode: normalizeCode(currentTeam, DEFAULT_TEAM),
      targetTeamCodes,
      targetChannelCodes,
      targetRoles,
      durationSeconds,
      text: messageText
    });

    clearBroadcastSendPendingState();
    broadcastSendInFlight = true;
    setBroadcastSendSummary("Mengirim broadcast...", "sending", "Menunggu konfirmasi server...");
    broadcastSendPendingTimerId = window.setTimeout(() => {
      if (!broadcastSendInFlight) {
        return;
      }

      broadcastSendInFlight = false;
      setBroadcastSendSummary(
        "Konfirmasi broadcast belum diterima.",
        "warning",
        "Cek koneksi atau coba kirim ulang."
      );
    }, 10000);
  });
}

if (loginConfigForm) {
  loginShowTeamToggle?.addEventListener("click", () => {
    const nextEnabled = !(loginShowTeamToggle.dataset.enabled === "true");
    setLoginToggleButtonState(loginShowTeamToggle, nextEnabled);
    loginShowTeamToggle.dataset.enabled = nextEnabled ? "true" : "false";
  });

  loginShowChannelToggle?.addEventListener("click", () => {
    const nextEnabled = !(loginShowChannelToggle.dataset.enabled === "true");
    setLoginToggleButtonState(loginShowChannelToggle, nextEnabled);
    loginShowChannelToggle.dataset.enabled = nextEnabled ? "true" : "false";
  });

  loginConfigForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!canManageRoles(normalizeRole(currentRole))) {
      notify("Hanya owner/admin yang bisa ubah login member.", "warning", { inlineDuration: 2800 });
      return;
    }

    const nextConfig = normalizeLoginConfig({
      showTeamSelect: loginShowTeamToggle?.dataset.enabled !== "false",
      showChannelSelect: loginShowChannelToggle?.dataset.enabled !== "false",
      teamOptions: String(loginTeamOptionsInput?.value || ""),
      channelOptions: String(loginChannelOptionsInput?.value || "")
    });

    socket.emit("login:config:update", { config: nextConfig });
  });
}

if (uploadConfigForm) {
  uploadConfigForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!canManageRoles(normalizeRole(currentRole))) {
      notify("Hanya owner/admin yang bisa ubah batas upload.", "warning", { inlineDuration: 2800 });
      return;
    }

    const nextConfig = normalizeUploadConfig({
      imageLimitMb: uploadImageLimitInput?.value,
      videoLimitMb: uploadVideoLimitInput?.value,
      audioLimitMb: uploadAudioLimitInput?.value,
      fileLimitMb: uploadFileLimitInput?.value
    });

    socket.emit("upload:config:update", { config: nextConfig });
  });
}

if (directAdminEnabledToggle) {
  directAdminEnabledToggle.addEventListener("click", () => {
    const nextEnabled = !(directAdminEnabledToggle.dataset.enabled === "true");
    setDirectAdminToggleButtonState(directAdminEnabledToggle, nextEnabled);
    directAdminEnabledToggle.dataset.enabled = nextEnabled ? "true" : "false";
  });
}

if (directAdminConfigForm) {
  directAdminConfigForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!canManageRoles(normalizeRole(currentRole))) {
      notify("Hanya owner/admin yang bisa ubah chat langsung ke admin.", "warning", { inlineDuration: 2800 });
      return;
    }

    const nextConfig = normalizeDirectAdminConfig({
      enabled: directAdminEnabledToggle?.dataset.enabled !== "false"
    });

    socket.emit("direct-admin:config:update", { config: nextConfig });
  });
}

if (directAdminDmButton) {
  directAdminDmButton.addEventListener("click", () => {
    if (!hasJoinedServer) {
      notify("Join team dulu sebelum chat langsung ke admin.", "warning", { inlineDuration: 2600 });
      return;
    }

    if (!currentDirectAdminConfig.enabled) {
      notify("Fitur chat langsung ke admin sedang dinonaktifkan.", "warning", { inlineDuration: 2800 });
      return;
    }

    socket.emit("dm:direct-admin:start");
  });
}

if (pinnedNoticeClear) {
  pinnedNoticeClear.addEventListener("click", () => {
    if (!canPinMessages(normalizeRole(currentRole))) {
      notify("Hanya owner/admin yang bisa unpin pesan.", "warning", { inlineDuration: 2800 });
      return;
    }

    if (currentView.type !== "channel") {
      return;
    }

    socket.emit("chat:unpin", { channelCode: currentChannel });
  });
}

socket.on("auth:self-updated", (payload) => {
  const previousUser = currentUser;
  const previousRole = currentRole;
  currentUser = normalizeDisplayName(payload?.name || currentUser);
  currentRole = normalizeRole(payload?.role || currentRole);
  syncDmHistoryClearCutoffProfile();
  syncHiddenDmRoutesProfile();

  if (pendingSettingsPassword) {
    currentAccessPassword = pendingSettingsPassword;
  }

  pendingSettingsPassword = "";
  if (settingsUsernameInput) {
    settingsUsernameInput.value = "";
  }
  if (settingsPasswordInput) {
    settingsPasswordInput.value = "";
  }

  notify("Akun login berhasil diperbarui.", "success", { inlineDuration: 3200 });
  setHeader();

  const profileChanged = previousUser !== currentUser || previousRole !== currentRole;
  if (profileChanged && demoModeEnabled && hasJoinedServer) {
    clearDemoBots({ silent: true });
    ensureAutoCrowdUsers();
    renderUsers(currentPresenceUsers);
  }
});

socket.on("team:notice:updated", (payload) => {
  currentTeamNotice = normalizeTeamNotice(payload?.noticeMessage, currentTeamNotice || DEFAULT_TEAM_NOTICE);
  renderTeamNotice();
});

socket.on("broadcast:sent", (payload) => {
  clearBroadcastSendPendingState();
  const scope = String(payload?.scope || "active").toLowerCase();
  const deliveredCount = Array.isArray(payload?.deliveredChannels) ? payload.deliveredChannels.length : 0;
  const deliveredRecipients = Array.isArray(payload?.deliveredRecipients)
    ? payload.deliveredRecipients.length
    : (Array.isArray(payload?.deliveredMembers) ? payload.deliveredMembers.length : 0);
  const queuedRecipients = Array.isArray(payload?.queuedRecipients) ? payload.queuedRecipients.length : 0;
  const targetTeamCodes = Array.isArray(payload?.targetTeamCodes)
    ? payload.targetTeamCodes.map((teamCode) => normalizeCode(teamCode, "")).filter(Boolean)
    : [];
  const targetTeamCode = normalizeCode(payload?.targetTeamCode || targetTeamCodes[0] || currentTeam, normalizeCode(currentTeam, DEFAULT_TEAM));
  const teamLabel = targetTeamCodes.length > 1
    ? `${targetTeamCodes.length} team`
    : targetTeamCode;

  if (broadcastMessageInput) {
    broadcastMessageInput.value = "";
  }

  if (scope === "all") {
    setBroadcastSendSummary(`Terkirim ke semua channel (${deliveredCount}).`, "success", "Broadcast berhasil dikirim.");
    notify(`Broadcast ${teamLabel} terkirim ke semua channel (${deliveredCount}).`, "success", { inlineDuration: 3200 });
    return;
  }

  if (scope === "channel") {
    setBroadcastSendSummary(
      `Terkirim ke #${normalizeCode(payload?.channelCode || currentChannel, DEFAULT_CHANNEL)}.`,
      "success",
      "Broadcast berhasil dikirim."
    );
    notify(
      `Broadcast ${targetTeamCode} ke #${normalizeCode(payload?.channelCode || currentChannel, DEFAULT_CHANNEL)} terkirim.`,
      "success",
      { inlineDuration: 3200 }
    );
    return;
  }

  if (scope === "members") {
    if (queuedRecipients > 0) {
      setBroadcastSendSummary(
        `Online ${deliveredRecipients} user, offline ${queuedRecipients} member diantrikan.`,
        "queued",
        "Sebagian penerima offline disimpan ke antrian."
      );
      notify(
        `Broadcast ${targetTeamCode}: terkirim ke ${deliveredRecipients} user online, ${queuedRecipients} member offline diantrikan.`,
        "success",
        { inlineDuration: 3600 }
      );
      return;
    }

    setBroadcastSendSummary(`Terkirim ke ${deliveredRecipients} member/guest online.`, "success", "Broadcast berhasil dikirim.");
    notify(
      `Broadcast ${teamLabel} ke penerima tercentang terkirim (${deliveredRecipients}).`,
      "success",
      { inlineDuration: 3200 }
    );
    return;
  }

  if (scope === "independent") {
    const teamBroadcastTeams = Array.isArray(payload?.teamBroadcastTeams)
      ? payload.teamBroadcastTeams.length
      : 0;
    const channelBroadcastTargets = Array.isArray(payload?.channelBroadcastTargets)
      ? payload.channelBroadcastTargets.length
      : 0;
    const deliveredMemberRecipients = Array.isArray(payload?.deliveredMemberRecipients)
      ? payload.deliveredMemberRecipients.length
      : 0;
    const deliveredGuestRecipients = Array.isArray(payload?.deliveredGuestRecipients)
      ? payload.deliveredGuestRecipients.length
      : 0;
    const queuedMemberRecipients = Array.isArray(payload?.queuedMemberRecipients)
      ? payload.queuedMemberRecipients.length
      : 0;
    const selectedRoles = Array.isArray(payload?.targetRoles)
      ? payload.targetRoles.map((role) => String(role || "").trim().toLowerCase()).filter(Boolean)
      : [];

    const parts = [];
    if (teamBroadcastTeams > 0) {
      parts.push(`Team ${teamBroadcastTeams}`);
    }
    if (channelBroadcastTargets > 0) {
      parts.push(`Channel ${channelBroadcastTargets}`);
    }
    if (deliveredMemberRecipients > 0) {
      parts.push(`Member ${deliveredMemberRecipients}`);
    }
    if (deliveredGuestRecipients > 0) {
      parts.push(`Guest ${deliveredGuestRecipients}`);
    }
    if (deliveredRecipients > 0 && deliveredMemberRecipients === 0 && deliveredGuestRecipients === 0) {
      parts.push(`DM ${deliveredRecipients}`);
    }

    if (queuedRecipients > 0) {
      const routeText = parts.length > 0 ? `${parts.join(" • ")} • ` : "";
      const queuedLabel = queuedMemberRecipients > 0
        ? `Antrian ${queuedMemberRecipients} member offline.`
        : `Antrian ${queuedRecipients} penerima offline.`;
      setBroadcastSendSummary(
        `${routeText}${queuedLabel}`,
        "queued",
        "Jalur independen: team/channel global + DM privat sesuai checklist."
      );
      notify(
        `Broadcast independen selesai. ${routeText}antrian offline ${queuedRecipients}.`,
        "success",
        { inlineDuration: 3600 }
      );
      return;
    }

    const summaryText = parts.length > 0
      ? `${parts.join(" • ")} terkirim.`
      : (() => {
        const hasGuest = selectedRoles.includes("guest");
        const hasMember = selectedRoles.includes("member");
        if (hasGuest && hasMember) {
          return "Tidak ada member/guest online yang cocok dengan checklist.";
        }
        if (hasGuest) {
          return "Tidak ada guest online yang cocok dengan checklist.";
        }
        if (hasMember) {
          return "Tidak ada member online yang cocok dengan checklist.";
        }
        return "Tidak ada target yang cocok dengan checklist.";
      })();
    const state = parts.length > 0 ? "success" : "warning";
    setBroadcastSendSummary(summaryText, state, "Jalur independen aktif sesuai checklist.");
    notify(`Broadcast independen: ${summaryText}`, parts.length > 0 ? "success" : "warning", { inlineDuration: 3200 });
    return;
  }

  setBroadcastSendSummary(`Terkirim ke channel aktif (${deliveredCount}).`, "success", "Broadcast berhasil dikirim.");
  notify(`Broadcast ${targetTeamCode} ke channel aktif terkirim (${deliveredCount}).`, "success", { inlineDuration: 3200 });
});

socket.on("broadcast:notice", (payload) => {
  const noticeScope = String(payload?.scope || "channel").toLowerCase();
  const noticeTeamCode = normalizeCode(payload?.teamCode || currentTeam, normalizeCode(currentTeam, DEFAULT_TEAM));
  const noticeChannelCode = normalizeCode(payload?.channelCode || currentChannel, normalizeCode(currentChannel, DEFAULT_CHANNEL));
  if (noticeScope === "members") {
    if (noticeTeamCode !== normalizeCode(currentTeam, DEFAULT_TEAM)) {
      return;
    }

    showBroadcastNotice(payload || {});
    return;
  }

  if (currentView.type !== "channel") {
    return;
  }

  if (noticeTeamCode !== normalizeCode(currentTeam, DEFAULT_TEAM) || noticeChannelCode !== normalizeCode(currentChannel, DEFAULT_CHANNEL)) {
    return;
  }

  showBroadcastNotice(payload || {});
});

socket.on("broadcast:received", (payload) => {
  const senderName = normalizeDisplayName(payload?.senderName || "Admin");
  const text = String(payload?.text || "").trim();
  const preview = text.length > 72 ? `${text.slice(0, 72)}...` : text;
  notify(`Pesan baru dari ${senderName}: ${preview || "Broadcast masuk."}`, "info", {
    inlineDuration: 3400,
    toast: true,
    toastDuration: 3600
  });
});
