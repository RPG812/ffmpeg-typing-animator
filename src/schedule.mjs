/**
 * Build typing schedule: timestamps when each character becomes visible
 * We include the prompt in visible length but do not trigger clicks for it
 */
export function buildSchedule({ text, perCharMin, perCharMax, punctBoost, leadingPrompt }) {
  const visible = leadingPrompt + text
  const items = []
  let t = 0

  for (let i = 0; i < visible.length; i++) {
    const ch = visible[i]
    let dt = rand(perCharMin, perCharMax)

    if (/[),.;:]/.test(ch)) {
      dt += punctBoost
    }

    t += dt
    items.push({
      index: i,
      char: ch,
      at: t,
      click: i >= leadingPrompt.length // clicks only for user-typed chars
    })
  }

  return {
    text,
    leadingPrompt,
    total: t,
    items
  }
}

function rand(a, b) {
  return a + Math.random() * (b - a)
}
