# Task

**Goal:**  
Consolidate duplicate product entries into single, enriched records per product, maximizing available information while ensuring uniqueness.

---

## Context

The dataset contains product details extracted from various web pages using LLMs.  
Many products appear multiple times with partial or overlapping attributes. Each row represents a “partial” view of a product.

---

## Guidelines

1. **Understand the problem before coding.**

   - Align on what defines a “duplicate” in this dataset.
   - Avoid misinterpretation or wasted effort.

2. **Analyze the schema and attributes.**

   - Identify key fields (e.g., `name`, `brand`, `image_url`, `price`, `description`).
   - Note missing values, variations in spelling, formatting differences.

3. **No single “right” solution.**

   - Document your assumptions and trade-offs.
   - Support each decision with relevant rationale.

4. **Tech stack freedom.**

   - Use any language or libraries you prefer (we generally like Scala, Java, Python, Node.js).
   - Scalability is impressive but not required for this dataset size.

5. **Document thoroughly.**
   - Explain your approach, why you chose it, and what you might do differently at scale.

---

## Resources

- **Dataset file:**  
  `veridion_product_deduplication_challenge.snappy.parquet`  
  (Converted to CSV in `output.csv`)

---

## Expected Deliverables

1. **Solution explanation / presentation**

   - A clear write-up (Markdown, slides, PDF) describing:
     - Problem understanding
     - Data exploration insights
     - Duplication criteria and grouping logic
     - Consolidation rules for merging fields
     - Any limitations or future improvements

2. **Output dataset**

   - A new CSV (`deduplicated_products.csv`) containing one enriched row per unique product.

3. **Code and Logic**
   - All scripts or source files used to:
     1. Read and parse the CSV
     2. Detect and group duplicates
     3. Merge records into enriched entries
     4. Write out the final CSV
   - Include comments or README instructions to run your code.
