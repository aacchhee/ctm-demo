-- Compile authored Markdown solutions with the same Pandoc writer as the page.
-- The browser only selects a rendered variant; it does not parse Markdown.
local directory = debug.getinfo(1, "S").source:sub(2):match("^(.*)[/\\]")
return {{Pandoc = function(doc)
  if not doc.meta["stack-page"] or not quarto.doc.is_format("html") then return doc end
  -- math-exercise pools accept HTML but do not parse Markdown in the browser.
  -- Compile these page-specific pools here, protecting their answer markers.
  local function task_html(source)
    local fields = {}
    source = source:gsub("(_+%b[])", function(marker)
      fields[#fields + 1] = marker
      return "STACKFIELDPLACEHOLDER" .. #fields .. "END"
    end)
    local task = pandoc.read(source, "markdown"):walk({Math = function(math)
      return pandoc.Span({math}, pandoc.Attr("", {}, {
        ["data-ai-feedback-tex"] = math.text,
        ["data-ai-feedback-display"] = math.mathtype == "DisplayMath" and "true" or "false"
      }))
    end})
    local html = pandoc.write(task, "html", {
      html_math_method = "mathjax", wrap_text = "none"
    }):gsub("\n", " ")
    return html:gsub("STACKFIELDPLACEHOLDER(%d+)END", function(index)
      return fields[tonumber(index)]
    end)
  end
  doc.blocks = doc.blocks:walk({CodeBlock = function(block)
    if not block.text:match("#| label: stack%-") then return block end
    local options, body = block.text:match("^(#|.-)\n\n(.*)$")
    assert(options and body, "STACK pool is missing its option header")
    local tasks = {}
    for task in (body .. "\n\n---\n\n"):gmatch("(.-)\n\n%-%-%-\n\n") do
      tasks[#tasks + 1] = task_html(task)
    end
    block.text = options .. "\n\n" .. table.concat(tasks, "\n\n---\n\n")
    return block
  end})
  local file = assert(io.open(directory .. "/../assets/stack/variants.json", "r"))
  local variants = pandoc.json.decode(file:read("*a")); file:close()
  for _, variant in pairs(variants) do
    variant.solution = pandoc.write(pandoc.read(variant.solution, "markdown"), "html", {
      html_math_method = "mathjax", wrap_text = "none"
    })
  end
  local data = quarto.json.encode(variants):gsub("<", "\\u003c"):gsub(">", "\\u003e"):gsub("&", "\\u0026")
  quarto.doc.include_text("before-body", "<script>window.stackVariants = " .. data .. ";</script>")
  quarto.doc.add_html_dependency({name = "stack-page", version = "1.0.0", scripts = {directory .. "/../assets/stack/page.js"}})
  return doc
end}}
