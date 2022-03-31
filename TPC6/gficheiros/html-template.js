
exports.fileList = fileList

// File List HTML Page Template  -----------------------------------------
function fileList( files, d){
    let pagHTML = `
        <html>
            <head>
                <title>Gestor de Ficheiros</title>
                <meta charset="utf-8"/>
                <link rel="icon" href="favicon.png"/>
                <link rel="stylesheet" href="w3.css"/>
            </head>
            <body>
                <div class="w3-container w3-teal">
                <h2>File Upload</h2>
                </div>

                <form class="w3-container" action="/files/upload" method="POST" enctype="multipart/form-data">
                <label class="w3-text-teal"><b>Select file</b></label>
                <input class="w3-input w3-border w3-light-grey" type="file" name="myFile">
                <input class="w3-btn w3-blue-grey" type="submit" value="Submit"/>
                </form>

              <div class="w3-card-4 modal" id="display"></div>

              <div class="w3-container w3-teal">
                  <h2>File List</h2>
              </div>
              <table class="w3-table w3-bordered">
                  <tr>
                      <th>Date</th>
                      <th>File</th>
                      <th>Size</th>
                      <th>Type</th>
                      <th>Download</th>
                      <th>Delete</th>
                  </tr>
    `
    files.forEach( f => {
      pagHTML += `
          <tr onclick='showImage(\"${f.name}", \"${f.mimetype}\");'>
              <td>${f.date}</td>
              <td>${f.name}</td>
              <td>${f.size}</td>
              <td>${f.mimetype}</td>
              <td> 
                    <form class="w3-container" action="/files/download" method="POST" enctype="multipart/form-data">
                    <input type="hidden" name="myFile" value=${f.name}>
                    <input class="w3-btn w3-blue-grey" type="submit" value="Download"/>
                    </form>
              </td>
              <td> 
                    <form class="w3-container" action="/files/delete" method="POST" enctype="multipart/form-data">
                    <input type="hidden" name="myFile" value=${f.name}>
                    <input class="w3-btn w3-blue-grey" type="submit" value="Delete"/>
              </form>
        </td>
              
          </tr>
      `
    })
  
    pagHTML += `
          </table>
          <div class="w3-container w3-teal">
              <address>-------------- Generated by AROM@RPCW2022 em ${d} --------------</address>
          </div>
      </body>
      </html>
    `
    return pagHTML
  }
