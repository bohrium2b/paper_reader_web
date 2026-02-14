# APEX PastPapers Reader

This is a React-based application that renders a PDF viewer and associated logic for viewing CIE-style papers. 

Papers are in the format `[4-digit code]_[s/w/m][2-digit year]_[qp (Question Paper)/ms (Markscheme)]_[1-digit component code][Variant 1/2/3].pdf` eg. `9709_s24_qp_23.pdf`. In the example, the subject/syllabus is 9709, the season is summer (s), the year is 2024, the document is the question paper (qp), the component is Paper 2, and the variant is 3. 

Navigation is controlled using react-router-dom, using the hash router `/#/papers/FILENAME`.
