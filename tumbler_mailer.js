var mandrill = require('XXXXX');
var mandrill_client = new mandrill.Mandrill('1S6y0rfENEcID9F8MAyHWw');

var fs = require('fs');
var ejs = require('ejs');

var csvFile = fs.readFileSync("friend_list.csv","utf8");
var emailTemplate = fs.readFileSync('email_template.html', 'utf8');

var tumblr = require('tumblr.js');

var client = tumblr.createClient({
  consumer_key: 'XXXXXXXXXX',
  consumer_secret: 'XXXXXXXX',
  token: 'XXXXXXXXX',
  token_secret: 'XXXXXXXXX'
});


function csvParse(csvFile){
    var array = [];
    var arr = csvFile.split("\n");
    var obj;

    prop = arr.shift().split(",");

    arr.forEach(function(line){
        line = line.split(",");
        obj = {};

        for(var i =0; i < line.length; i++){
            obj[prop[i]] = line[i];
        }
      array.push(obj);

    })
    return array;
}


client.posts('anastasiias.tumblr.com', function(err, blog){
  var latestPosts = [];
      blog.posts.forEach(function(post){
        var current = new Date();
        var msinOneWeek = 7 * 24 * 60* 60 * 1000;
        var weekAgo = (current - msinOneWeek);
        var post_publ = new Date (post[date]);
        var post_publ_ms = post_publ.getTime();
        if(post_publ_ms < current && post_publ_ms > weekAgo){
        latestPosts.push(post);
      }
      return latestPosts;
  })

friendList = csvParse(csvFile);

friendList.forEach(function(row){

    var firstName = row["firstName"];
    var numMonthsSinceContact = row["numMonthsSinceContact"];

    templateCopy = emailTemplate;
      
    var customizedTemplate = ejs.render(emailTemplate, {firstName: firstName,
                                       numMonthsSinceContact: numMonthsSinceContact,
                                       latestPosts: latestPosts
                                                                  
                              });

    sendEmail(firstName, row["emailAddress"], "Nastia S", "anastasiasergienko@gmail.com", "testing", customizedTemplate);                                     
 
});

    function sendEmail(to_name, to_email, from_name, from_email, subject, message_html){
    var message = {
        "html": message_html,
        "subject": subject,
        "from_email": from_email,
        "from_name": from_name,
        "to": [{
                "email": to_email,
                "name": to_name
            }],
        "important": false,
        "track_opens": true,    
        "auto_html": false,
        "preserve_recipients": true,
        "merge": false,
        "tags": [
            "Fullstack_Tumblrmailer_Workshop"
        ]    
    };
    var async = false;
    var ip_pool = "Main Pool";
    mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) { 
    }, function(e) {
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    });
 
}
