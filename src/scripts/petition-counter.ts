import { supabase } from "../lib/supabase";

const counter = document.querySelector<HTMLElement>("[data-petition-count]");

async function loadCounter() {
  if (!counter) return;

  const { data, error } = await supabase.rpc("get_petition_count");

  if (error) {
    console.error(error);
    return;
  }

  counter.textContent = Number(data).toLocaleString("ms-MY");
}

loadCounter();