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
  inputSearch.oninput = (function (obj) { return function () { obj.options.filters.master = inputSearch.value.toLowerCase(); obj.render(); } })(this)
  this.menu_container.append(inputSearch);

  // Settings container
  // let selectorRows = document.createElement("select");
  // let selectorCols = document.createElement("select");
  // selectorRows.setAttribute('multiple', true);
  // selectorCols.setAttribute('multiple', true);
  // for (let i = 0; i < this.headers.length; i++)
  // {
  //   let optionRows = document.createElement('option');
  //   let optionCols = document.createElement('option');
  //   optionRows.value = i;
  //   optionCols.value = i;
  //   optionRows.textContent = this.headers[i];
  //   optionCols.textContent = this.headers[i];
  //   // optionRows.setAttribute('selected', true);
  //   selectorRows.appendChild(optionRows);
  //   selectorCols.appendChild(optionCols);
  // }

  // selectorRows.onchange = (function (obj) { return function () { 
  //   console.log(selectorRows.options);
  //   // obj.options.filters.master = this.value.toLowerCase();
  //   // obj.render(); 
  // }})(this)

  // this.settings_container.append(selectorRows);
  // this.settings_container.append(selectorCols);

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
   let rowMap = {};
   for (let i = 0; i < this.rows.length; i++)
   {
    let keys = [];
    for (let i2 = 0; i2 < this.options.pivot.rows.length; i2++) {
     keys.push(this.rows[i][this.options.pivot.rows[i2]]);
    }
    const key = keys.join('|');
    if (typeof rowMap[key] == 'undefined') { rowMap[key] = [key, keys, 1]; }
    else { rowMap[key][2]++; } // Count
   }
   const rows = Object.values(rowMap);

   // Sorting
   rows.sort(function(a,b) { return a[0] < b[0] ? 1 : -1 });

   // Rendering
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
   let total_grand_label = document.createElement("th"); total_grand_label.textContent = 'Totals'; total_grand_label.colSpan = this.options.pivot.rows.length;
   let total_grand_value = document.createElement("th"); total_grand_value.textContent = total_grand;
   tr.append(total_grand_label, total_grand_value);
   tfoot.append(tr);
  }
  else if (this.options.pivot.rows.length == 0 && this.options.pivot.cols.length > 0) // Cols
  {
    let colMap = {};
    for (let i = 0; i < this.rows.length; i++)
    {
    let keys = [];
    for (let i2 = 0; i2 < this.options.pivot.cols.length; i2++) {
      keys.push(this.rows[i][this.options.pivot.cols[i2]]);
    }
    const key = keys.join('|');
    if (typeof colMap[key] == 'undefined') { colMap[key] = [key, keys, 1]; }
    else { colMap[key][2]++; } // Count
    }
    const cols = Object.values(colMap);

    // Sorting
    cols.sort(function(a,b) { return a[0] > b[0] ? 1 : -1 });
    
    // Headers
    for (let i = 0; i < this.options.pivot.cols.length; i++)
    {
      let tr = document.createElement("tr");
      let name = document.createElement("th"); name.textContent = this.headers[this.options.pivot.cols[i]];
      tr.append(name);
      for (let i2 = 0; i2 < cols.length; i2++)
      {
        let label = document.createElement("th");
        label.textContent = cols[i2][1][i];
        tr.append(label);
      }
      if (i == 0) {
        let label = document.createElement('th');
        label.textContent = 'Totals';
        label.rowSpan = this.options.pivot.cols.length;
        tr.append(label);
      }
      thead.append(tr);
    }

    // Footer
    let tr = document.createElement("tr");
    let total_grand_label = document.createElement("th"); total_grand_label.textContent = 'Totals';
    tr.append(total_grand_label);

    for (let i = 0; i < cols.length; i++)
    {
      let value = document.createElement("th");
      value.textContent = cols[i][2];
      tr.append(value);
    }

    let total_grand_value = document.createElement("th"); total_grand_value.textContent = total_grand;
    tr.append(total_grand_value);
    tfoot.append(tr);
  }
  else // Rows & Cols
  {
    // Data
    let colMap = {};
    let rowMap = {};
    let matrix = {};
    for (let i = 0; i < this.rows.length; i++) {
      let col_keys = [];
      let row_keys = [];
      let matrix_keys = [];
      for (let i2 = 0; i2 < this.options.pivot.cols.length; i2++) { col_keys.push(this.rows[i][this.options.pivot.cols[i2]]); }
      for (let i2 = 0; i2 < this.options.pivot.rows.length; i2++) { row_keys.push(this.rows[i][this.options.pivot.rows[i2]]); }
      let col_key = col_keys.join('|');
      let row_key = row_keys.join('|');
      let matrix_key = row_key + '|' + col_key;
      if (typeof colMap[col_key] == 'undefined') { colMap[col_key] = [col_key, col_keys, 1]; } else { colMap[col_key][2]++; } // Count
      if (typeof rowMap[row_key] == 'undefined') { rowMap[row_key] = [row_key, row_keys, 1]; } else { rowMap[row_key][2]++; } // Count
      if (typeof matrix[matrix_key] == 'undefined') { matrix[matrix_key] = 1; } else { matrix[matrix_key]++; } // Count
    }
    const cols = Object.values(colMap);
    const rows = Object.values(rowMap);

    // Sorting
    let type = 0;
    let order = true;
    if (this.options.pivot.sort.cols.type == 'total') { type = 2; } else { type = 0; }
    if (this.options.pivot.sort.cols.order) { cols.sort(function(a,b) { return a[type] > b[type] ? 1 : -1 }); }
    else { cols.sort(function(a,b) { return a[type] < b[type] ? 1 : -1 }); }
    
    if (this.options.pivot.sort.rows.type == 'total') { type = 2; } else { type = 0; }
    if (this.options.pivot.sort.rows.order) { rows.sort(function(a,b) { return a[type] > b[type] ? 1 : -1 }); }
    else { rows.sort(function(a,b) { return a[type] < b[type] ? 1 : -1 }); }
    // Matrix value sorting TODO
    
    // Headers
    for (let i = 0; i < this.options.pivot.cols.length; i++) {
      let tr = document.createElement("tr");
      let label = document.createElement("th");
      label.textContent = this.headers[this.options.pivot.cols[i]];
      label.colSpan = this.options.pivot.rows.length;
      // Label click sorting
      label.onclick = (function (obj) { return function () {
        if (obj.options.pivot.sort.cols.type == 'label') { obj.options.pivot.sort.cols.order = !obj.options.pivot.sort.cols.order; }
        else { obj.options.pivot.sort.cols.type = 'label'; obj.options.pivot.sort.cols.order = true; }
        obj.render();
      }})(this);
      tr.append(label);

      for (let i2 = 0; i2 < cols.length; i2++) {
        let label = document.createElement("th");
        label.textContent = cols[i2][1][i];
        if ((i+1) == this.options.pivot.cols.length) { label.rowSpan = 2; }
        tr.append(label);
      }
      if (i == 0) {
        let label = document.createElement('th');
        label.textContent = 'Totals';
        label.rowSpan = this.options.pivot.cols.length + 1;

        // Totals click sorting
        label.onclick = (function (obj) { return function () {
          if (obj.options.pivot.sort.rows.type == 'total') { obj.options.pivot.sort.rows.order = !obj.options.pivot.sort.rows.order; }
          else { obj.options.pivot.sort.rows.type = 'total'; obj.options.pivot.sort.rows.order = true; }
          obj.render();
        }})(this);
        tr.append(label);
      }
      thead.append(tr);
    }

    // Row labels
    let tr2 = document.createElement('tr');
    for (let i = 0; i < this.options.pivot.rows.length; i++) {
      let label = document.createElement('th');
      label.textContent = this.headers[this.options.pivot.rows[i]];
      // Label click sorting
      label.onclick = (function (obj) { return function () {
        if (obj.options.pivot.sort.rows.type == 'label') { obj.options.pivot.sort.rows.order = !obj.options.pivot.sort.rows.order; }
        else { obj.options.pivot.sort.rows.type = 'label'; obj.options.pivot.sort.rows.order = true; }
        obj.render();
      }})(this);
      tr2.append(label);
    }
    thead.append(tr2);

    // Body
    for (let i = 0; i < rows.length; i++) {
      let tr = document.createElement("tr");
      // Row label
      for (let i2 = 0; i2 < rows[i][1].length; i2++) {
        let label = document.createElement("th");
        label.textContent = rows[i][1][i2];
        tr.append(label);
      }
      // Matrix values
      for (let i2 = 0; i2 < cols.length; i2++) {
        let matrix_key = rows[i][0] + '|' + cols[i2][0];
        let value = document.createElement("th");
        value.textContent = matrix[matrix_key];
        tr.append(value);
      }
      // Row total
      let value = document.createElement("th");
      value.textContent = rows[i][2];
      tr.append(value);
      tbody.append(tr);
    }

    // Footer
    let tr = document.createElement("tr");
    let label = document.createElement("th");
    label.textContent = 'Totals';
    label.colSpan = this.options.pivot.rows.length;
    // Totals sorting
    label.onclick = (function (obj) { return function () {
      if (obj.options.pivot.sort.cols.type == 'total') { obj.options.pivot.sort.cols.order = !obj.options.pivot.sort.cols.order; }
      else { obj.options.pivot.sort.cols.type = 'total'; obj.options.pivot.sort.cols.order = true; }
      obj.render();
    }})(this);
    tr.append(label);

    for (let i = 0; i < cols.length; i++) {
      let value = document.createElement("th");
      value.textContent = cols[i][2];
      tr.append(value);
    }

    let value = document.createElement("th");
    value.textContent = total_grand;
    tr.append(value);
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
