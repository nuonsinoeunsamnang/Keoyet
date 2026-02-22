# frozen_string_literal: true

source "https://rubygems.org"

# Jekyll 3.x supports Ruby 2.6; Jekyll 4.x requires Ruby 3+
gem "jekyll", "~> 3.9"
gem "kramdown-parser-gfm"
# Pin ffi so Ruby 2.6 gets a compatible version (1.17.x platform gems require Ruby 3+)
gem "ffi", ">= 1.15.0", "< 1.17"

group :jekyll_plugins do
  # GitHub Pages uses jekyll-remote-theme; we use minimal custom CSS only
end

platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo-data"
end
