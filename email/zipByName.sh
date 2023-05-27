mkdir -p zipped
for fname in *.*; do
    prefix=${fname%%.*}
    [ ! -f "$fname" ] || [ -f "$prefix.zip" ] && continue
    mkdir -p "$prefix"
    mv "$prefix".* "$prefix"
    cd "$prefix"
    i=0
    for f in *.*; do
        ext=${f##*.}
        mv "$f" "index.$ext"
        i=$((i+1))
    done
    zip -r "../zipped/$prefix.zip" .
    cd ..
done
