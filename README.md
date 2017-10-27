# Table Studier

When I was studying for the CompTIA exams (required by school), I found that there was quite a lot of tabular-type data to memorize. I became annoyed trying to adapt this to a vocabular-type format for use in Quizlet, so I made this.

The tables are drag-and-drop with the option to have checkbox columns for yes/no answers. Drag an answers to its proper cell and it will populate and turn green. Drag an answer to an incorrect cell and it will flash red and return to the answer bin at the bottom.

### Options
These options can be useful depending on the type of data you're memorizing or your own individual study style.

Option&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Description
------ | -----------
Hide Used Values | By default, answers return to the bin regardless of whether they are correct. When this is checked, accurate answers will become hidden but not change the order of the bin.
Delete Used Values | When checked, accurate answers will disappear from the answer bin. Answers in the bin will move around as accurate answers are placed in the table when this is checked.
Include First Column | Useful for when you need to know the order as well as the content of a table.
Shuffle Rows | Randomizes the order of the rows.

#### Setting Up the Data

All of the data is stored in the HTML file inside `<div id="data"></div>`.
- The cell values should be tab separated.
- Each section should be separated by a blank line.
- The first row in each section is the section's name.
- The second row should be the table headers

I used tabs so that sections could be easily pasted from Excel.

There are also a number of options that can be set for any section by including extra rows before the section data. These options are as follows and should be listed as they are found here:

Option&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Description
--- | ---
\*\*\*\*Subject Title | Used to specify the start of a new subject. Should be followed by an empty line.
++++wide | Forces the table to be as wide as possible.
++++short | Reduces the height of the rows to fit more rows on the screen.
++++answer | Adds an answer to the answer bin.
++++wrapcolumns:1,2,3... | By default, columns have wrapping turned off. Use this to specify a comma separated list of 0-indexed columns that should be allowed to wrap.
++++checkboxcolumns:0,2,4... | Use this to specify a comma separated list of 0-indexed columns that should be checkboxes instead of drag-and-drop. Use 0 and 1 to represent Yes and No in your data tables.
----Comment Text | Adds this text under the table and before the answer bin. More than one comment is allowed.
        
