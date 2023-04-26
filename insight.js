function insight(div, data, options) {

 this.data = data;
 this.options = options;

 this.headers = this.data.shift();
 this.rows = this.data;

 this.menu_container = document.createElement('div');
 this.pivot_container = document.createElement('div');
 this.table_container = document.createElement('div');

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
 document.getElementById(div).append(
  this.menu_container,
  this.pivot_container,
  this.table_container
 );

 this.render = function() {
  this.rows = [];

  // Filters
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

  // Nothing selected
  if (true) {
   let tr = document.createElement("tr");
   let total_grand_label = document.createElement("th"); total_grand_label.textContent = 'Totals';
   let total_grand_value = document.createElement("th"); total_grand_value.textContent = total_grand;
   tr.append(total_grand_label, total_grand_value);
   tfoot.append(tr);
  }
  // Rows
  // Cols
  // Rows & Cols

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
  for (let i = 0; i < this.headers.length; i++)
  {
   let th = document.createElement('th');
   th.textContent = this.headers[i];
   th.onclick = (function (obj) { return function () {
    if (obj.options.table.sort.col == i) { obj.options.table.sort.order = !obj.options.table.sort.order; }
    else { obj.options.table.sort.order = true; obj.options.table.sort.col = i; }
    obj.render();
   } })(this);
   tr.append(th);
  }
  thead.append(tr);
  
  // Body
  for (let i = 0; i < this.rows.length; i++)
  {
   let tr = document.createElement("tr");
   for (let i2 = 0; i2 < this.rows[i].length; i2++)
   {
    let td = document.createElement("td");
    td.textContent = this.rows[i][i2];
    tr.append(td);
   }
   tbody.append(tr);
  }

  table.append(thead);
  table.append(tbody);
  table.append(tfoot);
  this.table_container.append(table);
 };

 this.render();
}