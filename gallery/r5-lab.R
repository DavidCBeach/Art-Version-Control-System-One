
dat = read.csv("https://raw.githubusercontent.com/grbruns/cst383/master/1994-census-summary.csv")
str(dat)
nrow(dat)
unique(dat[,"marital_status"])
unique(dat[,"native_country"])
max(dat[,"age"])
min(dat[,"age"])


dat1 = dat[(sample(1:nrow(dat),500)),]

nrow(dat1)
white


x = 10
 result = x  < 10
 length(result)