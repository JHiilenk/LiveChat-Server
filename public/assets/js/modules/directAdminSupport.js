(function initializeDirectAdminSupport(globalObject) {
  const normalizeDirectAdminConfig = (rawConfig) => {
    const config = rawConfig && typeof rawConfig === "object" ? rawConfig : {};
    return {
      enabled: config.enabled !== false
    };
  };

  const setDirectAdminToggleButtonState = (button, enabled) => {
    if (!button) {
      return;
    }

    const isEnabled = Boolean(enabled);
    button.textContent = isEnabled ? "ON" : "OFF";
    button.setAttribute("aria-pressed", isEnabled ? "true" : "false");
    button.classList.toggle("is-on", isEnabled);
  };

  const createDirectAdminUiSupport = ({ normalizeRole, isAdminPortal, elements, getState, setState }) => {
    const {
      directAdminEnabledToggle,
      directAdminDmButton,
      directAdminDmHint,
      joinDirectAdminField,
      joinDirectAdminInput,
      joinRoleSelect
    } = elements;

    const isPublicChatRole = (role) => role === "guest" || role === "member";

    const syncAdminForm = (configInput = getState().currentDirectAdminConfig) => {
      const config = normalizeDirectAdminConfig(configInput);
      setDirectAdminToggleButtonState(directAdminEnabledToggle, config.enabled);
      if (directAdminEnabledToggle) {
        directAdminEnabledToggle.dataset.enabled = config.enabled ? "true" : "false";
      }
    };

    const updateActionVisibility = () => {
      const state = getState();
      const normalizedRole = normalizeRole(state.currentRole);
      const canUseDirectAdmin = !isAdminPortal
        && state.currentDirectAdminConfig.enabled
        && isPublicChatRole(normalizedRole)
        && Boolean(state.currentUser);

      if (directAdminDmButton) {
        directAdminDmButton.classList.toggle("hidden", !canUseDirectAdmin);
        directAdminDmButton.disabled = !canUseDirectAdmin || !state.hasJoinedServer;
      }

      if (directAdminDmHint) {
        directAdminDmHint.classList.toggle("hidden", !canUseDirectAdmin);
      }
    };

    const applyConfig = (configInput) => {
      const state = getState();
      const nextConfig = normalizeDirectAdminConfig(configInput || state.currentDirectAdminConfig);
      setState({ currentDirectAdminConfig: nextConfig });
      syncAdminForm(nextConfig);
      updateActionVisibility();

      const selectedRole = normalizeRole(joinRoleSelect?.value || "guest");
      const canShowJoinOption = !isAdminPortal
        && nextConfig.enabled
        && isPublicChatRole(selectedRole);

      if (joinDirectAdminField) {
        joinDirectAdminField.classList.toggle("hidden", !canShowJoinOption);
      }

      if (joinDirectAdminInput) {
        joinDirectAdminInput.value = "admins";
      }
    };

    return {
      normalizeConfig: normalizeDirectAdminConfig,
      setToggleButtonState: setDirectAdminToggleButtonState,
      syncAdminForm,
      updateActionVisibility,
      applyConfig
    };
  };

  globalObject.DirectAdminSupport = {
    normalizeDirectAdminConfig,
    setDirectAdminToggleButtonState,
    createDirectAdminUiSupport
  };
})(window);
