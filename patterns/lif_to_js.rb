re = /.*p=(.*)_106\.lif/;
puts 'game_of_life.patterns = {'
Dir.glob('*p=*.lif'){|fn|
  md = re.match(fn);
  basename = md.captures[0]
  puts "\t#{basename} : ["
  File.open(fn){|f|
    pts = []
    f.each {|l|
      unless (l.index('#'))
        ns = l.split(' ')
        pts << [ ns[0].to_i, ns[1].to_i ]
      end
    }
    begin
      pt = pts.shift
      comma = pts.count > 0 ? ',' : ''
      puts "\t\t#{pt}#{comma}"
    end until pts.count == 0
  }
  puts "\t],"
};
puts '};'
