function calcularAnosDesdeFundada() {
  // Data de referência: 29 de agosto de 1995
  const dataInicio = new Date(1995, 7, 29); // Mês é 0-indexed (0=janeiro, 7=agosto)
  const dataAtual = new Date();

  // Calcular a diferença em anos
  let anos = dataAtual.getFullYear() - dataInicio.getFullYear();

  // Ajustar se ainda não passou a data neste ano
  const mesAtual = dataAtual.getMonth();
  const diaAtual = dataAtual.getDate();

  // Se ainda não chegou em 29 de agosto deste ano, subtrair 1 ano
  if (mesAtual < 7 || (mesAtual === 7 && diaAtual < 29)) {
    anos--;
  }

  return anos;
}

function atualizarAnosNoElementoById(idElemento) {
  const anos = calcularAnosDesdeFundada();
  const elemento = document.getElementById(idElemento);
  if (elemento) {
    elemento.textContent = anos;
  } else {
    console.error(`Elemento com ID "${idElemento}" não encontrado.`);
  }
}

function atualizarAnosNoElementoByClass(className) {
  const elementos = document.getElementsByClassName(className);
  for (let i = 0; i < elementos.length; i++) {
    const elemento = elementos[i];
    const anos = calcularAnosDesdeFundada();
    elemento.textContent = anos;
  }
}

function atualizarAnosNoHeadTitle() {
  const anos = calcularAnosDesdeFundada();
  document.title = `Millenium Turismo | ${anos} anos líder em gestão de viagens`;
}

// Versão alternativa que retorna uma string formatada
function calcularAnosDesdeFundadaFormatado(idElemento, mostrarTexto = true) {
  const dataInicio = new Date(1995, 7, 29);
  const dataAtual = new Date();

  // Calcular diferença completa em anos, meses e dias
  let anos = dataAtual.getFullYear() - dataInicio.getFullYear();
  let meses = dataAtual.getMonth() - dataInicio.getMonth();
  let dias = dataAtual.getDate() - dataInicio.getDate();

  // Ajustar valores negativos
  if (dias < 0) {
    meses--;
    // Pegar o último dia do mês anterior
    const ultimoDiaMesAnterior = new Date(
      dataAtual.getFullYear(),
      dataAtual.getMonth(),
      0,
    ).getDate();
    dias += ultimoDiaMesAnterior;
  }

  if (meses < 0) {
    anos--;
    meses += 12;
  }

  // Formatar o resultado
  let textoResultado;
  if (anos === 1) {
    textoResultado = "1 ano";
  } else {
    textoResultado = `${anos} anos`;
  }

  // Opcional: incluir meses e dias
  const incluirDetalhes = false; // Mude para true se quiser mais detalhes
  if (incluirDetalhes && meses > 0) {
    textoResultado += ` e ${meses} ${meses === 1 ? "mês" : "meses"}`;
  }

  // Atualizar o elemento
  const elemento = document.getElementById(idElemento);
  if (elemento) {
    if (mostrarTexto) {
      elemento.textContent = textoResultado;
    } else {
      elemento.textContent = anos;
    }
  }

  return {
    anos: anos,
    meses: meses,
    dias: dias,
    texto: textoResultado,
  };
}

// Versão que pode ser usada diretamente no HTML como onclick
function atualizarAnosNoElemento(idElemento) {
  const anos = calcularAnosDesdeFundada(idElemento);
  console.log(`${anos} anos desde 29/08/1995`);
  return false; // Para prevenir comportamento padrão se usado em link
}

// JavaScript para controlar o vídeo de fundo
document.addEventListener("DOMContentLoaded", function () {
  // Verificar se o vídeo carregou, caso contrário usar fallback
  // Verificar se o vídeo carregou
  const video = document.querySelector(".hero-video");
  const heroSection = document.querySelector(".hero");

  // Evento quando o vídeo começa a tocar
  video.addEventListener("playing", function () {
    console.log("Vídeo está reproduzindo normalmente");
    heroSection.classList.remove("video-failed");
  });

  // Evento quando há erro no vídeo
  video.addEventListener("error", function () {
    console.log("Erro ao carregar vídeo, usando fallback");
    heroSection.classList.add("video-failed");
  });

  // Verificação adicional após 3 segundos
  setTimeout(function () {
    // Se o vídeo não está reproduzindo após 3 segundos
    if (video.paused || video.ended || video.readyState < 3) {
      console.log("Vídeo não está reproduzindo após 3s, usando fallback");
      heroSection.classList.add("video-failed");
    }
  }, 3000);

  // Tentar recarregar o vídeo se possível
  video.addEventListener("loadeddata", function () {
    // Tenta tocar o vídeo programaticamente (alguns navegadores exigem isso)
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch(function (error) {
        console.log("Autoplay bloqueado, usando fallback:", error);
        heroSection.classList.add("video-failed");
      });
    }
  });

  // Adicionar classe de animação suave ao rolar a página
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animated");
      }
    });
  }, observerOptions);

  // Observar elementos para animação
  document.querySelectorAll(".service-card, .contact-item").forEach((el) => {
    observer.observe(el);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  atualizarAnosNoElementoByClass("anos-desde-fundada");
});
atualizarAnosNoHeadTitle();
