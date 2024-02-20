#!/usr/bin/expect -f

set host [lindex $argv 0]
set port [lindex $argv 1]
set login [lindex $argv 2]
set password [lindex $argv 3]

spawn telnet $host $port
expect "Username:"
send "$login\r"
expect "Password:"
send "$password\r"
expect "GPON1.BSR#"
send "show gpon onu state \r"
    expect {
       " --More--" { send -- " "; exp_continue}
       "end\r" {send -- "exit\r"}
    }
    send "exit\r"
    puts "\r"
