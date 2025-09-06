// ==DantotsuSource==
// @name         AnimeKai
// @version      1.0.1
// @description  Anime source for animekai.to
// @author       ExZyO
// @match        https://animekai.to/*
// ==/DantotsuSource==

class AnimeKai {
  constructor() {
    this.name = "AnimeKai";
    this.baseUrl = "https://animekai.to";
    this.lang = "en";
  }

  // ?? Get popular anime (homepage list)
  async popular(page = 1) {
    const res = await fetch(`${this.baseUrl}/most-popular?page=${page}`);
    const html = await res.text();
    const dom = new DOMParser().parseFromString(html, "text/html");

    return [...dom.querySelectorAll(".flw-item")].map(card => ({
      title: card.querySelector(".film-name a")?.textContent.trim(),
      url: card.querySelector(".film-name a")?.href,
      thumbnail: card.querySelector("img")?.src
    }));
  }

  // ?? Search anime
  async search(query, page = 1) {
    const res = await fetch(`${this.baseUrl}/search?keyword=${encodeURIComponent(query)}&page=${page}`);
    const html = await res.text();
    const dom = new DOMParser().parseFromString(html, "text/html");

    return [...dom.querySelectorAll(".flw-item")].map(card => ({
      title: card.querySelector(".film-name a")?.textContent.trim(),
      url: card.querySelector(".film-name a")?.href,
      thumbnail: card.querySelector("img")?.src
    }));
  }

  // ?? Get episodes list (from watch page)
  async episodes(animeUrl) {
    const res = await fetch(animeUrl);
    const html = await res.text();
    const dom = new DOMParser().parseFromString(html, "text/html");

    return [...dom.querySelectorAll("#epslist a")].map(ep => ({
      title: ep.textContent.trim(),
      url: ep.href
    }));
  }

  // ?? Extract video sources from episode page
  async sources(episodeUrl) {
    const res = await fetch(episodeUrl);
    const html = await res.text();
    const dom = new DOMParser().parseFromString(html, "text/html");

    const iframe = dom.querySelector("iframe");
    if (!iframe) return [];

    const src = iframe.getAttribute("src");
    return [
      {
        url: src.startsWith("http") ? src : new URL(src, this.baseUrl).href,
        quality: "default"
      }
    ];
  }
}

window.source = new AnimeKai();