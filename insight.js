function Insight(div, data, options) {

 this.data = data;
 this.options = options;

 this.headers = this.data.shift();
 this.rows = this.data;

 this.menu_container = document.createElement('div');
 this.settings_container = document.createElement('div');
 this.pivot_container = document.createElement('div');
 this.table_container = document.createElement('div');

 // Menu container

  // Visiblity buttons
  let visibilityPivot = document.createElement('button'); visibilityPivot.textContent = 'Pivot';
  visibilityPivot.onclick = (function (obj) { return function () { obj.options.pivot.visible = !obj.options.pivot.visible; obj.render(); } })(this)

  let visibilityTable = document.createElement('button'); visibilityTable.textContent = 'Table';
  visibilityTable.onclick = (function (obj) { return function () { obj.options.table.visible = !obj.options.table.visible; obj.render(); } })(this)
  
  this.menu_container.append(visibilityPivot);
  this.menu_container.append(visibilityTable);

  // Master search
  let inputSearch = document.createElement("input");
  inputSearch.oninput = (function (obj) { return function () { obj.options.filters.master = this.value.toLowerCase(); obj.render(); } })(this)
  this.menu_container.append(inputSearch);

 // Container render
 document.getElementById(div).replaceChildren();
 document.getElementById(div).append(
  this.menu_container,
  this.settings_container,
  this.pivot_container,
  this.table_container
 );

 this.render = function() {
  
  // Filters
  this.rows = [];
  if (this.options.filters.master != "") { for (let i = 0; i < this.data.length; i++) { if (this.data[i].join().toLowerCase().includes(this.options.filters.master)) { this.rows.push(this.data[i]); } } }
  else { this.rows = this.data; }

  this.renderPivot();
  this.renderTable();
 }

 this.renderPivot = function() {

  this.pivot_container.replaceChildren();
  this.pivot_container.style.display = 'block';
  if (!this.options.pivot.visible) { this.pivot_container.style.display = 'none'; return; }

  let table = document.createElement("table");
  let thead = document.createElement("thead");
  let tbody = document.createElement("tbody");
  let tfoot = document.createElement("tfoot");

  // Formulas
  let total_grand = this.rows.length;

  // Rendering
  if (this.options.pivot.rows.length == 0 && this.options.pivot.cols.length == 0) // Nothing selected
  {
   let tr = document.createElement("tr");
   let total_grand_label = document.createElement("th"); total_grand_label.textContent = 'Totals';
   let total_grand_value = document.createElement("th"); total_grand_value.textContent = total_grand;
   tr.append(total_grand_label, total_grand_value);
   tfoot.append(tr);
  }
  else if (this.options.pivot.rows.length > 0 && this.options.pivot.cols.length == 0) // Rows
  {
   // Headers
   let headers = document.createElement("tr");
   for (let i = 0; i < this.options.pivot.rows.length; i++)
   {
    let header = document.createElement("th"); header.textContent = this.headers[this.options.pivot.rows[i]];
    headers.append(header);
   }
   let header = document.createElement("th"); header.textContent = 'Totals';
   headers.append(header);
   thead.append(headers);

   // Body
   let rows = {};
   for (let i = 0; i < this.rows.length; i++)
   {
    let keys = [];
    for (let i2 = 0; i2 < this.options.pivot.rows.length; i2++) {
     keys.push(this.rows[i][this.options.pivot.rows[i2]]);
    }
    key = keys.join('|');
    if (typeof rows[key] == 'undefined') { rows[key] = [key, keys, 1]; }
    else { rows[key][2]++; } // Count
   }
   rows = Object.values(rows);
   rows.sort(function(a,b) { return a[0] < b[0] ? 1 : -1 });

   for (let i = 0; i < rows.length; i++)
   {
    let tr = document.createElement("tr");
    for (let i2 = 0; i2 < rows[i][1].length; i2++)
    {
      let key = document.createElement("th"); key.textContent = rows[i][1][i2];
      tr.append(key);
    }

    let value = document.createElement("th"); value.textContent = rows[i][2];
    tr.append(value);
    tbody.append(tr);
    // console.log(rivi);
   }

   // Footer
   let tr = document.createElement("tr");
   let total_grand_label = document.createElement("th"); total_grand_label.textContent = 'Totals';
   let total_grand_value = document.createElement("th"); total_grand_value.textContent = total_grand;
   tr.append(total_grand_label, total_grand_value);
   tfoot.append(tr);
  }
  else if (this.options.pivot.rows.length == 0 && this.options.pivot.cols.length > 0) // Cols
  {
  }
  else // Rows & Cols
  {
   let tr = document.createElement("tr");
   let total_grand_label = document.createElement("th"); total_grand_label.textContent = 'Totals';
   let total_grand_value = document.createElement("th"); total_grand_value.textContent = total_grand;
   tr.append(total_grand_label, total_grand_value);
   tfoot.append(tr);
  }

  table.append(thead);
  table.append(tbody);
  table.append(tfoot);
  this.pivot_container.append(table);
 };

 this.renderTable = function() {

  this.table_container.replaceChildren();
  this.table_container.style.display = 'block';
  if (!this.options.table.visible) { this.table_container.style.display = 'none'; return; }

  let table = document.createElement("table");
  let thead = document.createElement("thead");
  let tbody = document.createElement("tbody");
  let tfoot = document.createElement("tfoot");

  // Table sorting
  let sort_col = this.options.table.sort.col;
  let sort_order = this.options.table.sort.order;
  if (sort_order) { this.rows.sort(function(a,b) { if (!isNaN(a[sort_col]) && !isNaN(b[sort_col])) { return Number(a[sort_col]) > Number(b[sort_col]) ? 1 : -1; } else { return a[sort_col] > b[sort_col] ? 1 : -1; }}); }
  else { this.rows.sort(function(a,b) { if (!isNaN(a[sort_col]) && !isNaN(b[sort_col])) { return Number(a[sort_col]) < Number(b[sort_col]) ? 1 : -1; } else { return a[sort_col] < b[sort_col] ? 1 : -1; }}); }

  // Headers
  let tr = document.createElement("tr");
  for (let i = 0; i < this.headers.length; i++) {
   let th = document.createElement('th');

   // Sorting handler
   th.onclick = (function (obj) { return function () {
    if (obj.options.table.sort.col == i) { obj.options.table.sort.order = !obj.options.table.sort.order; }
    else { obj.options.table.sort.order = true; obj.options.table.sort.col = i; }
    obj.render();
   } })(this);

   // Label content
   if (this.options.table.sort.col == i && this.options.table.sort.order) { th.textContent = this.headers[i] + ' ↑'; }
   else if (this.options.table.sort.col == i && !this.options.table.sort.order) { th.textContent = this.headers[i] + ' ↓'; }
   else { th.textContent = this.headers[i]; }
   tr.append(th);
  }
  thead.append(tr);
  
  // Body
  for (let i = 0; i < this.rows.length; i++) {
   if (i < 20) {
    let tr = document.createElement("tr");
    for (let i2 = 0; i2 < this.rows[i].length; i2++)
    {
     let td = document.createElement("td");
     td.textContent = this.rows[i][i2];
     tr.append(td);
    }
    tbody.append(tr);
   }
  }

  table.append(thead);
  table.append(tbody);
  table.append(tfoot);
  this.table_container.append(table);
 };

 this.render();
}
