v1 <-  c("foo","bar","baz")
print(v1[2])

v2 <- 1:3

print(v2)

x = sample(1:500,10)
print(x)
print(mean(x))
print(sum(x)/length(x))


dat = data.frame(jargon=c("foo","bar","baz", "whatevs"),points=c(1,2,3,4),stringsAsFactors=FALSE)

nrow(dat)
names(dat)
dat[2,]
dat[,"jargon"]
dat[1:2,"jargon"]
dat[dat$points>2,]
dat[length(dat$jargon)>3]


plot(mtcars$mpg,mtcars$disp,main="fish",xlab = "mileage",ylab="displacement",col="dark blue",pch = 16)
grid()
x = mean(mtcars$mpg)
abline(h=x,col="red",lty=2)
dat = mtcars[mtcars$am == 0]
points(dat$mpg,dat$disp,col="red")


myerr = function(x1,x2)
{
  stopifnot(length(x1)==length(x2)||(length(x1)<=0))
  sum((x1-x2)*(x1-x2))
}
myerr(1:5, c(1.2, 2.1, 3.5, 4.0, 4.8))

myerr2 = function(x1,x2,tolerance)
{
  stopifnot(length(x1)==length(x2)||(length(x1)<=0))
  sum(ifelse((x1-x2)*(x1-x2)>tolerance,1,0))/length(x1)
}
myerr2(1:5, c(1.2, 2.1, 3.5, 4.0, 4.8), 0.2)
