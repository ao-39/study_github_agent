#!/usr/bin/env bash
cd apps/app/dist

# ファイルサイズを適切な単位でフォーマットする関数
format_size() {
  local size=$1
  if [ $size -lt 1024 ]; then
    printf "%s B" "$(printf '%d' $size | sed ':a;s/\B[0-9]\{3\}\>/,&/;ta')"
  elif [ $size -lt 1048576 ]; then
    local kb=$((size * 100 / 1024))
    local kb_int=$((kb / 100))
    local kb_frac=$((kb % 100))
    if [ $kb_frac -eq 0 ]; then
      printf "%s KB" "$(printf '%d' $kb_int | sed ':a;s/\B[0-9]\{3\}\>/,&/;ta')"
    else
      printf "%d.%02d KB" $kb_int $kb_frac
    fi
  elif [ $size -lt 1073741824 ]; then
    local mb=$((size * 100 / 1048576))
    local mb_int=$((mb / 100))
    local mb_frac=$((mb % 100))
    if [ $mb_frac -eq 0 ]; then
      printf "%s MB" "$(printf '%d' $mb_int | sed ':a;s/\B[0-9]\{3\}\>/,&/;ta')"
    else
      printf "%d.%02d MB" $mb_int $mb_frac
    fi
  else
    local gb=$((size * 100 / 1073741824))
    local gb_int=$((gb / 100))
    local gb_frac=$((gb % 100))
    if [ $gb_frac -eq 0 ]; then
      printf "%s GB" "$(printf '%d' $gb_int | sed ':a;s/\B[0-9]\{3\}\>/,&/;ta')"
    else
      printf "%d.%02d GB" $gb_int $gb_frac
    fi
  fi
}

# 数値に桁区切りを追加する関数
add_commas() {
  printf '%d' "$1" | sed ':a;s/\B[0-9]\{3\}\>/,&/;ta'
}

# ファイルリストを取得（隠しファイルも含む）
find . -type f | sort > /tmp/build_files.txt

# 総ファイル数
total_files=$(wc -l < /tmp/build_files.txt)
echo "total_files=$(add_commas $total_files)" >> $GITHUB_OUTPUT

# 拡張子別ファイル数を算出（シンプルなアプローチ）
ext_summary=""

# 各拡張子のファイル数をカウント
js_count=$(grep -c '\.js$' /tmp/build_files.txt || echo "0")
css_count=$(grep -c '\.css$' /tmp/build_files.txt || echo "0")
html_count=$(grep -c '\.html$' /tmp/build_files.txt || echo "0")
svg_count=$(grep -c '\.svg$' /tmp/build_files.txt || echo "0")
map_count=$(grep -c '\.map$' /tmp/build_files.txt || echo "0")

# 拡張子別の結果を文字列形式で生成
if [ $js_count -gt 0 ]; then
  if [ "$ext_summary" != "" ]; then ext_summary+=", "; fi
  ext_summary+=".js: $(add_commas $js_count)件"
fi
if [ $css_count -gt 0 ]; then
  if [ "$ext_summary" != "" ]; then ext_summary+=", "; fi
  ext_summary+=".css: $(add_commas $css_count)件"
fi
if [ $html_count -gt 0 ]; then
  if [ "$ext_summary" != "" ]; then ext_summary+=", "; fi
  ext_summary+=".html: $(add_commas $html_count)件"
fi
if [ $svg_count -gt 0 ]; then
  if [ "$ext_summary" != "" ]; then ext_summary+=", "; fi
  ext_summary+=".svg: $(add_commas $svg_count)件"
fi
if [ $map_count -gt 0 ]; then
  if [ "$ext_summary" != "" ]; then ext_summary+=", "; fi
  ext_summary+=".map: $(add_commas $map_count)件"
fi

echo "ext_counts=$ext_summary" >> $GITHUB_OUTPUT

# ファイルサイズ情報を取得
max_size=0
total_size=0
max_file=""
files_table=""

while IFS= read -r file; do
  if [ -f "$file" ]; then
    # macOSとLinux対応のファイルサイズ取得
    size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo "0")
    # ファイル名とパスを整理
    filename=$(basename "$file")
    filepath=${file#./}  # ./を除去
    
    # ファイルサイズをフォーマット
    formatted_size=$(format_size $size)
    
    # テーブル行を追加
    if [ "$files_table" != "" ]; then files_table+="\n"; fi
    files_table+="| $filename | $formatted_size | $filepath |"
    
    # 最大サイズとファイル名を更新
    if [ $size -gt $max_size ]; then
      max_size=$size
      max_file="$filename"
    fi
    
    # 総サイズに加算
    total_size=$((total_size + size))
  fi
done < /tmp/build_files.txt

# フォーマットされたサイズ情報を出力
echo "max_size_formatted=$(format_size $max_size)" >> $GITHUB_OUTPUT
echo "max_file=$max_file" >> $GITHUB_OUTPUT
echo "total_size_formatted=$(format_size $total_size)" >> $GITHUB_OUTPUT

# ファイル詳細をマークダウンテーブル形式で出力
echo "files_table<<EOF" >> $GITHUB_OUTPUT
echo -e "$files_table" >> $GITHUB_OUTPUT
echo "EOF" >> $GITHUB_OUTPUT

# 一時ファイルを削除
rm -f /tmp/build_files.txt

