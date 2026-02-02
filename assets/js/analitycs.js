// ==============================
// CONFIGURAÇÃO CENTRALIZADA
// ==============================
const analyticsConfig = {
  // IDs DAS FERRAMENTAS (SUBSTITUA COM SEUS IDs)
  googleAnalytics: "G-CCGRD79PDP", // ID do Google Analytics 4
  facebookPixel: "257605640622255", // ID do Facebook Pixel
  facebookDomain: "passagensaereas.vip", // Domínio para Facebook Pixel
  hotjar: "3870721", // ID do Hotjar
  googleAds: "AW-7538804582", // ID do Google Ads

  // DOMÍNIO PRINCIPAL DA EMPRESA
  mainDomain: "milleniumturismo.com.br", // Domínio principal

  // CONFIGURAÇÕES DE PRIVACIDADE
  privacy: {
    anonymizeIp: true, // Anonimizar IPs no GA
    respectDoNotTrack: true, // Respeitar DNT
    enhancedPrivacy: true, // Privacidade aprimorada
  },

  // ATIVAÇÃO/DESATIVAÇÃO
  enabled: {
    all: true, // Controla tudo de uma vez
    googleAnalytics: true,
    facebookPixel: true,
    hotjar: true,
    googleAds: true,
  },

  // MODO DEBUG (desative em produção)
  debug: false,
};

// ==============================
// INICIALIZADOR PRINCIPAL
// ==============================
function initAnalytics() {
  // Verificar se está habilitado globalmente
  if (!analyticsConfig.enabled.all) {
    if (analyticsConfig.debug) console.log("Analytics desativados globalmente");
    return;
  }

  // Verificar DNT (Do Not Track)
  if (
    analyticsConfig.privacy.respectDoNotTrack &&
    navigator.doNotTrack === "1"
  ) {
    if (analyticsConfig.debug)
      console.log("Respeitando DNT - Analytics não carregados");
    return;
  }

  // ========== GOOGLE ANALYTICS 4 ==========
  if (
    analyticsConfig.enabled.googleAnalytics &&
    analyticsConfig.googleAnalytics
  ) {
    try {
      // Carregar script do gtag
      const gaScript = document.createElement("script");
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.googleAnalytics}`;
      gaScript.onerror = () => {
        if (analyticsConfig.debug)
          console.error("Erro ao carregar Google Analytics");
      };
      document.head.appendChild(gaScript);

      // Configurar dataLayer
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());

      // Configuração com anonimização de IP
      const gaConfig = {
        anonymize_ip: analyticsConfig.privacy.anonymizeIp,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname,
        // Configurar domínio do site
        site_url: `https://${analyticsConfig.mainDomain}`,
        // Parâmetros customizados para Millenium Turismo
        custom_map: {
          dimension1: "business_type",
          dimension2: "years_in_business",
        },
      };

      // Adicionar dados customizados da empresa
      gtag("set", {
        business_type: "travel_agency",
        years_in_business: 28,
      });

      // Adicionar configurações de privacidade aprimorada
      if (analyticsConfig.privacy.enhancedPrivacy) {
        gaConfig.restricted_data_processing = true;
        gaConfig.client_storage = "none";
      }

      gtag("config", analyticsConfig.googleAnalytics, gaConfig);

      if (analyticsConfig.debug) {
        console.log(
          "Google Analytics configurado para:",
          analyticsConfig.mainDomain,
        );
        console.log("Configurações:", gaConfig);
      }
    } catch (error) {
      if (analyticsConfig.debug)
        console.error("Erro no Google Analytics:", error);
    }
  }

  // ========== FACEBOOK PIXEL ==========
  if (analyticsConfig.enabled.facebookPixel && analyticsConfig.facebookPixel) {
    try {
      // Carregar Facebook Pixel
      !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = "2.0";
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        "script",
        "https://connect.facebook.net/en_US/fbevents.js",
      );

      // Configurações do Pixel
      const fbConfig = {};

      // Usar domínio do Facebook Pixel se especificado, senão usar domínio principal
      const fbDomain =
        analyticsConfig.facebookDomain || analyticsConfig.mainDomain;

      // Adicionar configuração de domínio
      if (fbDomain) {
        fbConfig.fbp = true;
        fbConfig.domain = fbDomain;

        // Adicionar dados do negócio
        fbConfig.external_id = analyticsConfig.facebookPixel;
        fbConfig.em = "customer_email_hash"; // Para quando tiver dados de email
      }

      // Inicializar Pixel
      fbq("init", analyticsConfig.facebookPixel, fbConfig);

      // Configurar domínio para autoConfig
      fbq("set", "autoConfig", analyticsConfig.facebookPixel, fbDomain);

      // Track PageView com dados customizados
      fbq("track", "PageView", {
        content_name: document.title,
        content_category: "Travel Agency",
        business_name: "Millenium Turismo",
        domain: fbDomain,
      });

      // Noscript fallback
      const noscript = document.createElement("noscript");
      noscript.innerHTML = `
                    <img height="1" width="1" style="display:none" 
                         src="https://www.facebook.com/tr?id=${analyticsConfig.facebookPixel}&ev=PageView&noscript=1&domain=${fbDomain}" 
                         alt="" />
                `;
      document.body.appendChild(noscript);

      if (analyticsConfig.debug) {
        console.log("Facebook Pixel configurado com domínio:", fbDomain);
      }
    } catch (error) {
      if (analyticsConfig.debug)
        console.error("Erro no Facebook Pixel:", error);
    }
  }

  // ========== HOTJAR ==========
  if (analyticsConfig.enabled.hotjar && analyticsConfig.hotjar) {
    try {
      // Configuração do Hotjar com domínio
      (function (h, o, t, j, a, r) {
        h.hj =
          h.hj ||
          function () {
            (h.hj.q = h.hj.q || []).push(arguments);
          };
        h._hjSettings = {
          hjid: parseInt(analyticsConfig.hotjar),
          hjsv: 6,
          // Configurações adicionais para o Hotjar
          hjsite: analyticsConfig.mainDomain,
        };
        a = o.getElementsByTagName("head")[0];
        r = o.createElement("script");
        r.async = 1;
        r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;

        // Adicionar atributos para identificar o domínio
        r.setAttribute("data-domain", analyticsConfig.mainDomain);
        r.setAttribute("data-hj-domain", analyticsConfig.mainDomain);

        a.appendChild(r);
      })(window, document, "https://static.hotjar.com/c/hotjar-", ".js?sv=");

      // Configurar Hotjar para rastrear domínio específico
      if (window.hj) {
        // Identificar sessão com dados da empresa
        hj("identify", analyticsConfig.mainDomain, {
          company: "Millenium Turismo",
          industry: "Travel Agency",
          years_in_business: 28,
          domain: analyticsConfig.mainDomain,
        });
      }

      if (analyticsConfig.debug)
        console.log("Hotjar configurado para:", analyticsConfig.mainDomain);
    } catch (error) {
      if (analyticsConfig.debug) console.error("Erro no Hotjar:", error);
    }
  }

  // ========== GOOGLE ADS ==========
  if (analyticsConfig.enabled.googleAds && analyticsConfig.googleAds) {
    try {
      // Se já temos gtag carregado (do Google Analytics)
      if (!window.gtag) {
        // Se não tiver, carregar o script do Google Ads separadamente
        const adsScript = document.createElement("script");
        adsScript.async = true;
        adsScript.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.googleAds}`;
        document.head.appendChild(adsScript);

        window.dataLayer = window.dataLayer || [];
        function gtag() {
          dataLayer.push(arguments);
        }
        gtag("js", new Date());
      }

      // Configurar Google Ads com anonimização e domínio
      gtag("config", analyticsConfig.googleAds, {
        anonymize_ip: analyticsConfig.privacy.anonymizeIp,
        page_title: document.title,
        page_location: window.location.href,
        // Parâmetros de conversão para agência de viagens
        conversion_label: "millenium_turismo_contact",
        business_name: "Millenium Turismo",
        business_domain: analyticsConfig.mainDomain,
        // Configurações específicas para viagens
        travel_agency: true,
        service_type: "corporate_leisure_travel",
      });

      // Adicionar evento de página view customizado para Google Ads
      gtag("event", "page_view", {
        send_to: analyticsConfig.googleAds,
        domain: analyticsConfig.mainDomain,
        page_type: "landing_page",
      });

      if (analyticsConfig.debug)
        console.log("Google Ads configurado para:", analyticsConfig.mainDomain);
    } catch (error) {
      if (analyticsConfig.debug) console.error("Erro no Google Ads:", error);
    }
  }

  // ========== CONFIGURAÇÕES GERAIS DE DOMÍNIO ==========
  // Configurar cookie domain para todos os serviços
  if (analyticsConfig.mainDomain) {
    // Configurar domínio para cookies (se aplicável)
    document.cookie = `millenium_domain=${analyticsConfig.mainDomain}; path=/; domain=.${analyticsConfig.mainDomain}; max-age=31536000`;

    // Meta tag para identificação do site
    const metaSite = document.createElement("meta");
    metaSite.name = "site_domain";
    metaSite.content = analyticsConfig.mainDomain;
    document.head.appendChild(metaSite);
  }

  // ========== FUNÇÕES DE EVENTOS PERSONALIZADOS ==========
  // Expor função para trackear eventos personalizados
  window.trackEvent = function (eventName, eventData = {}) {
    // Adicionar domínio automaticamente a todos os eventos
    const enhancedData = {
      ...eventData,
      domain: analyticsConfig.mainDomain,
      business: "Millenium Turismo",
      timestamp: new Date().toISOString(),
    };

    // Google Analytics
    if (window.gtag && analyticsConfig.enabled.googleAnalytics) {
      gtag("event", eventName, enhancedData);
    }

    // Facebook Pixel
    if (window.fbq && analyticsConfig.enabled.facebookPixel) {
      fbq("trackCustom", eventName, enhancedData);
    }

    // Hotjar
    if (window.hj && analyticsConfig.enabled.hotjar) {
      hj("event", eventName, enhancedData);
    }

    // Google Ads (eventos de conversão)
    if (
      window.gtag &&
      analyticsConfig.enabled.googleAds &&
      eventName.includes("conversion")
    ) {
      gtag("event", "conversion", {
        send_to: analyticsConfig.googleAds,
        ...enhancedData,
      });
    }

    if (analyticsConfig.debug) {
      console.log(
        `Evento trackeado [${analyticsConfig.mainDomain}]: ${eventName}`,
        enhancedData,
      );
    }
  };

  // ========== EVENTOS ESPECÍFICOS PARA AGÊNCIA DE VIAGENS ==========
  setTimeout(() => {
    // Trackear visualização da landing page
    trackEvent("view_landing_page", {
      page_name: "Millenium Turismo Landing Page",
      section_count: document.querySelectorAll("section").length,
      has_video: !!document.querySelector(".hero-video"),
      service_count: document.querySelectorAll(".service-card").length,
    });

    // Trackear domínio
    trackEvent("domain_identified", {
      main_domain: analyticsConfig.mainDomain,
      facebook_domain: analyticsConfig.facebookDomain,
      current_url: window.location.href,
    });
  }, 1000);
}

// ==============================
// VERIFICAÇÃO DE DOMÍNIO
// ==============================
function verifyDomainSetup() {
  const currentDomain = window.location.hostname;
  const isMainDomain = currentDomain.includes("milleniumturismo.com.br");
  const isPassagensDomain = currentDomain.includes("passagensaereas.vip");

  if (analyticsConfig.debug) {
    console.log("Verificação de domínio:");
    console.log("- Domínio atual:", currentDomain);
    console.log("- Domínio principal configurado:", analyticsConfig.mainDomain);
    console.log("- É domínio principal?", isMainDomain);
    console.log("- É domínio passagens?", isPassagensDomain);
  }

  // Ajustar configurações baseadas no domínio atual
  if (isPassagensDomain && !analyticsConfig.facebookDomain) {
    analyticsConfig.facebookDomain = "passagensaereas.vip";
  }

  return { currentDomain, isMainDomain, isPassagensDomain };
}

// ==============================
// INICIALIZAÇÃO AUTOMÁTICA
// ==============================
document.addEventListener("DOMContentLoaded", function () {
  // Verificar configuração de domínio
  verifyDomainSetup();

  // Inicializar analytics com pequeno delay
  setTimeout(initAnalytics, 500);
});

// Expor configurações para debug (opcional)
if (analyticsConfig.debug) {
  window.analyticsConfig = analyticsConfig;
  console.log(
    "Configurações de Analytics para Millenium Turismo:",
    analyticsConfig,
  );
}

document.addEventListener("DOMContentLoaded", function () {
  // Aguardar analytics carregarem
  setTimeout(() => {
    // ========== EVENTOS DE SERVIÇOS ==========
    const serviceCards = document.querySelectorAll(".service-card");
    serviceCards.forEach((card, index) => {
      card.addEventListener("click", function () {
        const serviceName = this.querySelector(".service-title").textContent;
        trackEvent("service_click", {
          service: serviceName,
          position: index + 1,
          section: "services",
        });
      });
    });

    // ========== EVENTOS DE CONTATO ==========
    // WhatsApp flutuante
    const whatsappBtn = document.querySelector(".whatsapp-float");
    if (whatsappBtn) {
      whatsappBtn.addEventListener("click", function () {
        trackEvent("whatsapp_contact", {
          contact_method: "whatsapp_float",
          phone_number: "(32) 3331-3106",
          domain: analyticsConfig.mainDomain,
        });
      });
    }

    // WhatsApp na seção de contatos
    const whatsappLinks = document.querySelectorAll(".whatsapp-link");
    whatsappLinks.forEach((link) => {
      link.addEventListener("click", function () {
        trackEvent("whatsapp_contact", {
          contact_method: "contact_section",
          phone_number: this.textContent.trim(),
          domain: analyticsConfig.mainDomain,
        });
      });
    });

    // ========== EVENTOS DE REDES SOCIAIS ==========
    const socialLinks = document.querySelectorAll(".social-link");
    socialLinks.forEach((link) => {
      link.addEventListener("click", function () {
        const platform = this.querySelector("i").className.match(/fa-(\w+)/)[1];
        trackEvent("social_media_click", {
          platform: platform,
          url: this.href,
          domain: analyticsConfig.mainDomain,
        });
      });
    });

    // ========== EVENTOS DE SCROLL ==========
    let sectionsViewed = new Set();
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !sectionsViewed.has(entry.target.id)) {
            sectionsViewed.add(entry.target.id);

            trackEvent("section_view", {
              section_id: entry.target.id,
              section_name:
                entry.target.querySelector("h2")?.textContent ||
                entry.target.className,
              view_order: sectionsViewed.size,
              domain: analyticsConfig.mainDomain,
            });
          }
        });
      },
      { threshold: 0.5 },
    );

    // Observar todas as seções
    document.querySelectorAll("section[id]").forEach((section) => {
      sectionObserver.observe(section);
    });

    // ========== EVENTO DE TEMPO NA PÁGINA ==========
    let startTime = Date.now();
    window.addEventListener("beforeunload", function () {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      if (timeSpent > 5) {
        // Só trackear se passou mais de 5 segundos
        trackEvent("page_time_spent", {
          seconds: timeSpent,
          minutes: Math.round((timeSpent / 60) * 10) / 10,
          sections_viewed: sectionsViewed.size,
          domain: analyticsConfig.mainDomain,
        });
      }
    });
  }, 1500); // Delay para garantir que analytics estejam carregados
});
