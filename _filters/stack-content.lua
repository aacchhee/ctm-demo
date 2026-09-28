-- STACK only supplies its figure adapter; generation belongs to math-exercise.
local directory = debug.getinfo(1, "S").source:sub(2):match("^(.*)[/\\]")
return {{Pandoc = function(doc)
  if doc.meta["stack-page"] and quarto.doc.is_format("html") then
    quarto.doc.add_html_dependency({name="stack-page", version="2.0.0", scripts={directory .. "/../assets/stack/page.js"}})
  end
  return doc
end}}
